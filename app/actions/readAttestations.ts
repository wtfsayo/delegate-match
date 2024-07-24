import { Address, Hex } from "viem";

import {  optimismGraphQLClient } from "@/app/utils/clients";
import { GET_ATTESTATIONS } from "@/app/utils/queries";
// import { schemaUID, AttestorAddress } from "@/app/utils/consts";
import getFcAddress from "./getFcAddress";


const variables = {
  "where": {
    "schemaId": {
      "equals": "0xa62c89f95f67faff1e3ade0db1fca88a09fe53fdc2cc8f41513c22f66f762c79"
    },
    "attester": {
      "equals": "0xf9467D97A8277D1C4ee4Ad346B1Ca523847019D9"
    },
    "recipient": {
      "equals": "0x715D7097C9446B8BDb166557E950cd1Cc5115126"
    }
  }
}





export default async function readAttestations({
  address,
  fid
}: { address?: Address, fid?: string | number }) {

  if (!address && !fid) {
    throw new Error("Either address or fid must be provided");
  }

  
  const recipient =  address || await getFcAddress(String(fid)) as Address;

  const attestations = await optimismGraphQLClient.request(
    GET_ATTESTATIONS,
    variables
  )

  return attestations ?? [];
}