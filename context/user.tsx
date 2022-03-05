import { createContext, useState, useEffect, FC, useContext } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/router'
import axios from 'axios'

const UserContext = createContext<any>(null)

const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user())
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        setUser({
          ...sessionUser,
          ...profile,
        })
      }
      setIsLoading(false)
    }

    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  useEffect(() => {
    axios.post('/api/set-supabase-cookie', {
      event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
      session: supabase.auth.session(),
    })
  }, [user])

  const login = async () => {
    supabase.auth.signIn({
      provider: 'github',
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const exposed = {
    user,
    login,
    logout,
    isLoading,
  }

  return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

export default UserProvider
