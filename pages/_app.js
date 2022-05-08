import '../styles/globals.css'
import {MoralisProvider} from 'react-moralis'
import {CompanyProvider} from '../context/CompanyContext'
import { ModalProvider } from 'react-simple-hook-modal'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
    serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}
    appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
    >
      <CompanyProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </CompanyProvider>

    </MoralisProvider>
  )
}

export default MyApp
