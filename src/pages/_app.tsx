import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-900 text-white h-screen w-screen relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 opacity-10" />
      <div className="z-10 absolute top-0 left-0 w-full h-full overflow-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
