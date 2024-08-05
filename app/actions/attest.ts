import { isAddress } from "viem";

import type { MultiAttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-sdk";

import getFcAddress from './getFcAddress';

// consts and clients
import { schemaUID, AttestationSigner } from '../utils/consts'
import { easServiceClient, schemaEncoder } from '../utils/clients';
import { isInteger } from "lodash";

export async function singleAttest(
    {
        promptStatement,
        choiceStatement,
        fid
    }: {
        promptStatement: string;
        choiceStatement: string;
        fid: number | string;
    }
) {
    // Signer must be an ethers-like signer.
    await easServiceClient.connect(AttestationSigner);


    // get address from #fid using neynar
    const address = await getFcAddress(fid);

    if (!isAddress(address) || !isInteger(fid) || !(Number(fid) > 0)) {
        console.log('Invalid Attestation Request or fid');
        return
    }

    // Initialize SchemaEncoder with the schema string

    const encodedData = schemaEncoder.encodeData([
        { name: "promptStatement", value: promptStatement, type: "string" },
        { name: "choiceStatement", value: choiceStatement, type: "string" },
        { name: "fid", value: String(fid), type: "uint32" },
    ]);


    const tx = await easServiceClient.attest({
        schema: schemaUID,
        data: {
            recipient: address,
            revocable: true,
            data: encodedData,
        },
    });
    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);
}


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

    // Signer must be an ethers-like signer.
    await easServiceClient.connect(AttestationSigner);


    // get address from #fid using neynar
    const address = await getFcAddress(fid);

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


    const chainId = await easServiceClient.getChainId()
    console.log({ chainId })

    const tx = await easServiceClient.multiAttest([attestationsData]);

    console.log(tx.receipt);
    const attestationId = await tx.wait();

    console.log("New attestation ID:", attestationId);

    return attestationId;
}
