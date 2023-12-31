import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (Ï
    <div className="bg-gray-900 text-white min-h-96 h-screen w-screen relative">
      <Head>
        <title>Chess TS</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 opacity-20" />
      <div className="z-10 absolute top-0 left-0 w-full h-full overflow-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
