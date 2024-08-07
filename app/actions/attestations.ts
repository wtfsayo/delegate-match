import { Address } from "viem";
import { optimismGraphQLClient } from "@/app/utils/clients";
import { GET_ATTESTATIONS } from "@/app/utils/queries";
import { schemaUID, AttestorAddress } from "@/app/utils/consts";
import getFcAddress from "@/app/actions/getFcAddress";

import { AttestationData } from "@/app/utils/interfaces";

export default async function getAttestations(fid: string | number) {
  if (!fid) {
    throw new Error("FID must be provided");
  }
  
  const recipient = await getFcAddress(fid);

  if(!recipient) {
    console.error("No recipient found");
  }

  console.log({recipient});

  const { attestations } = await optimismGraphQLClient.request<{
    attestations: Array<AttestationData>;
  }>(
    GET_ATTESTATIONS,
    {
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
  );

  if(!attestations) {
    console.error("No attestations found");
  }

  return attestations;
}
