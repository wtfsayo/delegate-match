import { Address, Hex } from "viem";

import { optimismGraphQLClient } from "@/app/utils/clients";
import { GET_ATTESTATIONS } from "@/app/utils/queries";
import { schemaUID, AttestorAddress } from "@/app/utils/consts";
import getFcAddress from "./getFcAddress";


export default async function readAttestations({
  address,
  fid
}: { address?: Address, fid?: string | number }) {

  if (!address && !fid) {
    throw new Error("Either address or fid must be provided");
  }


  const recipient = address || await getFcAddress(String(fid)) as Address;


  const variables = {
    "where": {
      "schemaId": {
        "equals": schemaUID
      },
      "attester": {
        "equals": AttestorAddress
      },
      "recipient": {
        "equals": recipient
      }
    }
  }


  const attestations = await optimismGraphQLClient.request(
    GET_ATTESTATIONS,
    variables
  )

  return attestations ?? [];
}