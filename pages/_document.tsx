"use client";
import Document, { Html, Main, Head, NextScript } from "next/document";
import { useSelector } from "react-redux";
import { RootReducers } from "../src/store/store.d";

function MyDocument() {
 

  return (
    <Html>
      {process.env.GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_ID}',{
              page_path: window.location.pathname,
            });
        `,
            }}
          />
        </>
      )}
      <Head />
      {/* <script type="module" src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"></script> */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/7.1.0/ionicons.min.js"></script>
      {/* (un)comment to allow OneSignal */}
      {/* <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script> */}
      <body className={``}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  return { ...initialProps };
};

export default MyDocument;
