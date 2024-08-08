import { optimismSepolia, optimism } from "viem/chains";

import type { Address, Hex } from "viem";
import { Wallet, JsonRpcProvider } from "ethers";


const relayerPvtKey = process.env.RELAYER_PRIVATE_KEY! as Hex;


export const easContractAddress = process.env.EAS_CONTRACT_ADDRESS ?? "0x4200000000000000000000000000000000000021";
export const schemaUID = process.env.SCHEMA_UID ?? "0xa62c89f95f67faff1e3ade0db1fca88a09fe53fdc2cc8f41513c22f66f762c79";
export const chain = optimism;
// process.env.NODE_ENV === "production" ? optimism : optimismSepolia;

const groveKey = process.env.GROVE_KEY!

// create RPC provider
export const RPCProvider = new JsonRpcProvider(`https://optimism-mainnet.rpc.grove.city/v1/${groveKey}`, {
    name: chain.name,
    chainId: chain.id,
}); // TODO: use non public RPC


export const AttestationSigner = new Wallet(relayerPvtKey as string, RPCProvider);  // Gas Account
export const AttestorAddress = AttestationSigner.address as Address;