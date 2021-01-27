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
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen/>
      <ToastContainer/>
    </QueryClientProvider>
  </Provider>
}
