import { isAddress } from "viem";

import type { MultiAttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-sdk";

import getFcAddress from './getFcAddress';
import getAttestations from "./attestations";
// consts and clients
import { schemaUID, AttestationSigner } from '@/app/utils/consts'
import { easServiceClient, schemaEncoder } from '@/app/utils/clients';
import { isInteger } from "lodash";


export async function multiAttest({
    statements,
    fid
}: {
    statements: {
        promptStatement: string;
        choiceStatement: string;
    }[];
    fid: number | string;
}) {


    console.log(statements, 'fromt attest fn');

    // Signer must be an ethers-like signer.
    await easServiceClient.connect(AttestationSigner);

    console.log("Signer", AttestationSigner.address);

    // get address from #fid using airstack
    const address = await getFcAddress(fid);

    console.log(address, 'of recipient from attest fn');

    // get existing attestations
    const existingAttestations = await getAttestations(fid);

    console.log(existingAttestations, 'tried to get attestations if existing');

    if (existingAttestations.length > 0) {
        console.log(existingAttestations, "Attestations already exist for this fid");
        return existingAttestations;
    }

    if (!isAddress(address) || !isInteger(fid) || !(Number(fid) > 0)) {
        console.log('Invalid Attestation Request or fid');
        return
    }

    const attestationsData = {
        schema: schemaUID,
        data:
            statements.map((statement) => {
                return {
                    recipient: address,
                    revocable: true,
                    data: schemaEncoder.encodeData(
                        [
                            { name: "promptStatement", value: statement.promptStatement, type: "string" },
                            { name: "choiceStatement", value: statement.choiceStatement, type: "string" },
                            { name: "fid", value: String(fid), type: "uint32" },
                        ]
                    )
                } as AttestationRequestData
            })

    } satisfies MultiAttestationRequest;
    

    console.log(String(attestationsData), 'from attest fn');

    const chainId = await easServiceClient.getChainId();

    console.log(Number(chainId), 'verify chainId from attest fn'); 

    const tx = await easServiceClient.multiAttest([attestationsData]);

    console.log(tx.receipt, 'if Tx receipt is available');

    const attestationId = await tx.wait();

    if(attestationId.length > 0)  {
        console.log("New attestation ID:", attestationId, 'from attestation function');
        return attestationId
    }


    throw new Error("No attestation ID returned or Something went wrong");
}
