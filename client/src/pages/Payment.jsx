import React from 'react';
import { LightningAddress } from "alby-tools";

function Payment() {


// fetch the LNURL data
  const fetchLn = async () => {
    const ln = new LightningAddress("nicholaskmilligan@getalby.com");
    await ln.fetch();
    // get the LNURL-pay data:
  console.log(ln.lnurlpData); // returns a [LNURLPayResponse](https://github.com/getAlby/alby-tools/blob/master/src/types.ts#L1-L15)
  // get the keysend data:
    console.log(ln.keysendData);
  }

  fetchLn();
  return (
    <div>
      404 Page Not Found
    </div>
  );
}

export default Payment;
