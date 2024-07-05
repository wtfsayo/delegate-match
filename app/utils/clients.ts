import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { easContractAddress } from "../utils/consts";

export const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);
export const easServiceClient = new EAS(easContractAddress);
export const schemaEncoder = new SchemaEncoder("string promptStatement,string choiceStatement,uint32 fid");