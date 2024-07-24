import { Address } from "viem";

import {  optimismGraphQLClient } from "@/app/utils/clients";
import { GET_ATTESTATIONS } from "@/app/utils/queries";
import { schemaUID, AttestorAddress } from "@/app/utils/consts";
import getFcAddress from "./getFcAddress";


const queryVariables = (schemaId: string, attester: Address, recipient: Address) => ({
  "where": {
    "schemaId": {
      "equals": schemaId
    },
    "attester": {
      "equals": attester
    },
    "recipient": {
      "equals": recipient
    }
  }
})



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
    queryVariables(schemaUID, AttestorAddress, recipient)
  )

  return attestations ?? [];
}