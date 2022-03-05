import { supabase } from '../../../utils/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
import initStripe from 'stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req)

  if (!user || !token) {
    return res.status(401).send('Unauthorized')
  }

  supabase.auth.setAuth(token)

  const { data: stripe_customer } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single()

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)
  const { priceId } = req.query

  const lineItems = [
    {
      price: priceId,
      quantity: 1,
    },
  ]

  console.log(stripe_customer);
  const session = await stripe.checkout.sessions.create({
    // customer: stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancelled",
  });

  console.log(session);

  res.send({
    id: session.id,
  })
}

export default handler
