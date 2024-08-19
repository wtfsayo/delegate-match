import { optimismSepolia, optimism } from "viem/chains";

import type { Address, Hex } from "viem";
import { Wallet, JsonRpcProvider } from "ethers";


const relayerPvtKey = process.env.RELAYER_PRIVATE_KEY! as Hex;


export const easContractAddress = process.env.EAS_CONTRACT_ADDRESS ?? "0x4200000000000000000000000000000000000021";
export const schemaUID = process.env.SCHEMA_UID ?? "0xa62c89f95f67faff1e3ade0db1fca88a09fe53fdc2cc8f41513c22f66f762c79";
export const chain = optimism;
// process.env.NODE_ENV === "production" ? optimism : optimismSepolia;

const alchemyKey = process.env.ALCHEMY_KEY!

// create RPC provider
export const RPCProvider = new JsonRpcProvider(`https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
    name: chain.name,
    chainId: chain.id,
}); // TODO: use non public RPC


export const AttestationSigner = new Wallet(relayerPvtKey as string, RPCProvider);  // Gas Account
export const AttestorAddress = AttestationSigner.address as Address;

export const educationQuest = [
    'Delegation on the Optimism blockchain allows you to assign your voting power to a trusted delegate, without transferring your tokens.',
    'When you delegate, your tokens remain in your wallet, but the delegate can vote on your behalf in governance decisions.',
    'To use this platform, complete the survey and we will provide your delegate matches and the associated links on Optimism Agora.',
    'To delegate, connect your wallet to the Optimism Agora governance platform, choose a delegate, and confirm the delegation transaction.'
]