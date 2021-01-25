import Document, {Html, Main, Head, NextScript} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <script type="module" src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"></script>
        {/*<script src="https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js" async></script>*/}
        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

