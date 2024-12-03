import { optimism } from "viem/chains";

import type { Address, Hex } from "viem";
import { Wallet, JsonRpcProvider } from "ethers";
import { ImageProps } from "@/components/ui/ImageContainer";


const relayerPvtKey = process.env.RELAYER_PRIVATE_KEY! as Hex;

export const easContractAddress =
  process.env.EAS_CONTRACT_ADDRESS ??
  "0x4200000000000000000000000000000000000021";
export const schemaUID =
  process.env.SCHEMA_UID ??
  "0xa62c89f95f67faff1e3ade0db1fca88a09fe53fdc2cc8f41513c22f66f762c79";
export const chain = optimism;
// process.env.NODE_ENV === "production" ? optimism : optimismSepolia;

const alchemyKey = process.env.ALCHEMY_KEY!;

// create RPC provider
export const RPCProvider = new JsonRpcProvider(
  `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  {
    name: chain.name,
    chainId: chain.id,
  }
); // TODO: use non public RPC

export const AttestationSigner = new Wallet(
  relayerPvtKey as string,
  RPCProvider
); // Gas Account
export const AttestorAddress = AttestationSigner.address as Address;

export const educationQuest = [
  "Delegation on the Optimism blockchain allows you to assign your voting power to a trusted delegate, without transferring your tokens.",
  "When you delegate, your tokens remain in your wallet, but the delegate can vote on your behalf in governance decisions.",
  "To use this platform, complete the survey and we will provide your delegate matches and the associated links on Optimism Agora.",
  "To delegate, connect your wallet to the Optimism Agora governance platform, choose a delegate, and confirm the delegation transaction.",
];

export const homePageIntroText = [
  "Introducing Delegate Match", "A revolutionary governance tool in a Farcaster Frame designed to empower OP token holders in the Optimism ecosystem.",
  "Our mission is to bridge the gap between token holders and their delegates, ensuring that voting power is aligned with shared values and a collective vision for the network.",
  "Too often, OP holders are left in the dark when it comes to understanding the governance philosophies and decision-making processes of potential delegates.",
  "The Delegate Match Farcaster Frame changes that. By adapting the proven model of Voting Advice Applications, we've created a Delegate Match Application that puts the power back in the hands of the community.",
  "Through a simple survey, OP holders can share their priorities and preferences across a range of governance-related topics.", 
  "The algorithm then matches these responses with the values of select OP delegates, providing a clear and transparent compatibility score.",
  "This empowers token holders to make informed decisions about where to delegate their voting power.",
];

export const congratsText = [
  "Congratulations!",
  "Based on your responses, we've identified the Optimism delegates that align most closely with your views and preferences.",
  "These are your top matches along with their respective scores.",
  "How to Read Your Results",
  "Match Percentage: This score indicates how closely each delegate's positions align with your responses. A higher percentage means a closer match.",
  "Top Matches: The parties or candidates listed at the top are those with the highest alignment to your views.",
  "Next Steps",
  "View Delegate: Click the button to read more about the delegate’s positions and policies on Optimism Agora.",
  "Delegate your OP: Use this information to make an informed decision to delegate your tokens for OP governance.",
  "Share Your Results: Let your friends and family know about your matches by sharing your results on social media.",
  "Mint the Originals NFT: Rewards are inbound for those who hold this legendary NFT."
];

export const imagesSingle: ImageProps[] = [
  { src: "/logo-dm.png", alt: "Delegate Match", },
  { src: "/logo-rg.png", alt: "Raidguild"},
];

export const imagesGrid: ImageProps[] = [
  { src: "/dm-vec.png", alt: "Delegate Match Mark",  },
  { src: "/sun-vec.png", alt: "Optimism Sun like image",  },
];