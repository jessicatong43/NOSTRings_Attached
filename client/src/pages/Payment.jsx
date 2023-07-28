import React from 'react';
import { LightningAddress } from 'alby-tools';

function Payment({ edition }) {
  // fetch the LNURL data
  const fetchLn = async () => {
    const ln = new LightningAddress('nicholaskmilligan@getalby.com');
    await ln.fetch();
    // const invoice = await ln.requestInvoice({
    //   satoshi: amount,
    //   comment: "Payment for chat prompt",
    // });

    console.log(ln.lnurlpData);
    console.log(ln.keysendData);
  };

  fetchLn();
  return (
    <div>
      404 Page Not Found
    </div>
  );
}

export default Payment;
