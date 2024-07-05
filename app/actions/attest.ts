import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { privateKeyToAccount } from "viem/accounts";
import type { Address } from "viem";
import { isAddress } from "viem";
import { sepolia, optimism } from "viem/chains";
import getFcAddress from './getFcAddress';
import {
    JsonRpcProvider,
    JsonRpcSigner,
} from 'ethers';

const easContractAddress = process.env.EAS_CONTRACT_ADDRESS ?? "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const schemaUID = process.env.SCHEMA_UID ?? "0xa62c89f95f67faff1e3ade0db1fca88a09fe53fdc2cc8f41513c22f66f762c79";

const chain = process.env.NODE_ENV === "production" ? optimism : sepolia;

const eas = new EAS(easContractAddress);

const relayerPvtKey = process.env.RELAYER_PRIVATE_KEY;
const account = privateKeyToAccount(relayerPvtKey as Address);

// create RPC provider
const provider = new JsonRpcProvider(chain.rpcUrls.default.http[0], chain); // TODO: use non public RPC

// create signer with ethers
const signer = new JsonRpcSigner(provider, account.address);


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
    await eas.connect(signer);


    // get address from #fid using neynar

    const address = await getFcAddress(fid);

    if (!isAddress(address)) {
        console.log('Invalid Attestation Request or fid');
        return
    }

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("string promptStatement,string choiceStatement,uint32 fid");
    const encodedData = schemaEncoder.encodeData([
        { name: "promptStatement", value: promptStatement, type: "string" },
        { name: "choiceStatement", value: choiceStatement, type: "string" },
        { name: "fid", value: fid, type: "uint32" },
    ]);
    const tx = await eas.attest({
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