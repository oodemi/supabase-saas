import { useEffect } from 'react'
import { NextPage } from 'next'
import { useUser } from '../context/user'

const Logout: NextPage = () => {
  const { logout } = useUser()
  useEffect(logout, [])

  return <p>Logging in</p>
}

export default Logout
