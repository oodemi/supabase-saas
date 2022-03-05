import '../styles/globals.css'
import type { AppProps } from 'next/app'
import UserProvider from '../context/user'
import Nav from '../components/Nav'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
