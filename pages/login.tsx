import { useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { NextPage } from 'next'
import { useUser } from '../context/user'

const Login: NextPage = () => {
  const { login } = useUser()

  useEffect(login, [])

  return <p>Logging in</p>
}

export default Login
