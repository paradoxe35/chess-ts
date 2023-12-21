import dynamic from "next/dynamic";

const Chess = dynamic(() => import("@/lib/chess"), {
  ssr: false,
});

export default function Home() {
  return <Chess />;
}
