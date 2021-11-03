import Head from "next/head";
import Landing from "../components/Landing";

export default function Home() {
  return (
    <div>
      <Head>
        <title>nft mintr</title>
        <meta name="description" content="nft mintr" />
      </Head>

      <Landing />
    </div>
  );
}
