import './reset.css'
import './font.css'
import './index.css'
import type { AppProps } from 'next/app'

const WebApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default WebApp
