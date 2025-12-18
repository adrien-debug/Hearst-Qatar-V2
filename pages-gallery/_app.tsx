import type { AppProps, AppContext } from 'next/app';
import NextApp from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Guard: évite un crash Next rare (Component undefined)
  if (!Component) return null;
  return <Component {...pageProps} />;
}

// Fix robuste: évite "Cannot read properties of undefined (reading 'getInitialProps')"
App.getInitialProps = async (appContext: AppContext) => {
  if (!appContext.Component) {
    return { pageProps: {} };
  }
  return await NextApp.getInitialProps(appContext);
};
