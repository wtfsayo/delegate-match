import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { easContractAddress } from "@/app/utils/consts";
import { GraphQLClient } from "graphql-request";

import { optimism, sepolia, optimismSepolia } from "viem/chains";

export const airstackClient = new GraphQLClient("https://api.airstack.xyz/graphql");
export const easServiceClient = new EAS(easContractAddress);
export const schemaEncoder = new SchemaEncoder("string promptStatement,string choiceStatement,uint32 fid");


const optimismEndpoint = `https://optimism.easscan.org/graphql`;
const optimismSepoliaEndpoint = `https://optimism-sepolia.easscan.org/graphql`;
const sepoliaEndpoint = `https://sepolia.easscan.org/graphql`;

const getGraphQLEndpoint = (chainId: number) => {
    switch (chainId) {
        case optimism.id:
            return optimismEndpoint;
        case optimismSepolia.id:
            return optimismSepoliaEndpoint;
        case sepolia.id:
            return sepoliaEndpoint;
        default:
            throw new Error("Chain ID not supported");
    }
}

export const easGraphQLClient = (chainId: number) => new GraphQLClient(getGraphQLEndpoint(chainId));

export const optimismGraphQLClient = easGraphQLClient(optimism.id);
export const optimismSepoliaGraphQLClient = easGraphQLClient(optimismSepolia.id);
export const sepoliaGraphQLClient = easGraphQLClient(sepolia.id);