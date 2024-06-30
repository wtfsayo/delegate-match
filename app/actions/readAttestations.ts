import { Address } from "viem";

export default async function readAttestations(address?: Address, fid?: string | number) {

    if(!address && !fid) {
        throw new Error("Either address or fid must be provided");
    }
    // TODO: read attestations
    return [];
}