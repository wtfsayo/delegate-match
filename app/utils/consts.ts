import { sepolia, optimism } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { Address } from "viem";
import { JsonRpcProvider, JsonRpcSigner } from "ethers";


const relayerPvtKey = process.env.RELAYER_PRIVATE_KEY!;


export const easContractAddress = process.env.EAS_CONTRACT_ADDRESS ?? "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
export const schemaUID = process.env.SCHEMA_UID ?? "0xa62c89f95f67faff1e3ade0db1fca88a09fe53fdc2cc8f41513c22f66f762c79";
export const chain = process.env.NODE_ENV === "production" ? optimism : sepolia;

export const attestationSigner = privateKeyToAccount(relayerPvtKey as Address);  // Gas Account


// create RPC provider
export const RPCProvider = new JsonRpcProvider(chain.rpcUrls.default.http[0], chain); // TODO: use non public RPC

// create signer with ethers
export const AttestationSigner = new JsonRpcSigner(RPCProvider, attestationSigner.address);