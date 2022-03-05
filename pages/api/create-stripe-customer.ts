import type { NextApiRequest, NextApiResponse } from 'next'
import initStripe from 'stripe'
import { getServiceSupabase } from '../../utils/supabase'

type Data = {
  message: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res
      .status(401)
      .send({ message: 'You are not authorized to call this API' })
  }

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  })

  const supabase = getServiceSupabase()

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id,
    })
    .eq('id', req.body.record.id)

  res.send({ message: `stripe customer created: ${customer.id}` })
}

export default handler
