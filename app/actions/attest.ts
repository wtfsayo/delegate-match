import { isAddress } from "viem";
import getFcAddress from './getFcAddress';

// consts and clients
import { schemaUID,  AttestationSigner } from '../utils/consts'
import { easServiceClient, schemaEncoder } from '../utils/clients';
import { isInteger } from "lodash";



// async function to attest
async function Attest(
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
        { name: "fid", value: Number(fid), type: "uint32" },
    ]);



    const tx = await easServiceClient.attest({
        schema: schemaUID,
        data: {
            recipient: address,
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            data: encodedData,
        },
    });
    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);
}