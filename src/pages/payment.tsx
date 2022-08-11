import type { NextPage } from "next";
import Head from "next/head";
import { PaymentView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Payment</title>
        <meta name="description" content="Payment" />
      </Head>
      <PaymentView />
    </div>
  );
};

export default Home;
