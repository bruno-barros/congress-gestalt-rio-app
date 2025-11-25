'use client';
import '../styles/global.scss'
import {Provider} from "react-redux";
import store from "../src/store/_store";
import {ReactQueryDevtools} from "react-query/devtools";
import {QueryClient, QueryClientProvider} from "react-query";
import '../src/i18n'
import {ToastContainer} from "react-toastify";
import {useRouter} from "next/router";
import {useEffect} from "react";
import * as gtag from '../src/gtag'
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import { GoogleOAuthProvider } from '@react-oauth/google';

Sentry.init({
  dsn: "https://bd05263f28054e61bd1d0292d9dda332@o517410.ingest.sentry.io/5625184",
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.production ? 'production' : 'development',
  // We recommend adjusting this value in production,
  // or using tracesSampler for finer control. Between 0 and 1
  tracesSampleRate: 0.5,
});

const stored = store();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  }
});

export default function App({Component, pageProps}) {

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Provider store={stored}>
    <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_ID}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen/>
        <ToastContainer/>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </Provider>
}
