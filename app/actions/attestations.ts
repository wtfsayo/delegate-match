import { optimismGraphQLClient } from "@/app/utils/clients";
import { GET_ATTESTATIONS } from "@/app/utils/queries";
import { schemaUID, AttestorAddress } from "@/app/utils/consts";
import getFcAddress from "@/app/actions/getFcAddress";

import { AttestationData } from "@/app/utils/interfaces";
import { surveyQuestions } from "@/app/utils/surveyQuestions";
import { revalidatePath } from "next/cache";

export default async function getAttestations(fid: string | number) {
  if (!fid) {
    throw new Error("FID must be provided");
  }

  const recipient = await getFcAddress(fid);

  if (!recipient) {
    console.error("No recipient found");
  }

  revalidatePath("/matches/" + fid);

  const { attestations } = await optimismGraphQLClient.request<{
    attestations: Array<AttestationData>;
  }>(GET_ATTESTATIONS, {
    where: {
      schemaId: {
        equals: schemaUID,
      },
      attester: {
        equals: AttestorAddress,
      },
      recipient: {
        equals: recipient,
      },
    },
  });

  console.log({ attestations }, fid);

  if (!attestations) {
    console.error("No attestations found");
  }

  if (attestations.length > surveyQuestions.length) {
    console.error("Too many attestations found");
    return attestations.slice(-surveyQuestions.length);
  }

  return attestations;
}
