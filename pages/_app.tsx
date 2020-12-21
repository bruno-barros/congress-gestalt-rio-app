import '../styles/global.scss'
import {Provider} from "react-redux";
import store from "../src/store/_store";
import {ReactQueryDevtools} from "react-query/devtools";
import {QueryClient, QueryClientProvider} from "react-query";
import '../src/i18n'
import {ToastContainer} from "react-toastify";

const stored = store();

const queryClient = new QueryClient({
 defaultOptions: {
   queries: {
     refetchOnWindowFocus: false
   }
 }
});

export default function App({Component, pageProps}) {
  return <Provider store={stored}>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen/>
      <ToastContainer/>
    </QueryClientProvider>
  </Provider>
}
