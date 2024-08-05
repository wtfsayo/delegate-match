import { get } from "lodash";
import { neynarClient } from "../utils/clients";
import { getAddress } from "viem";

export default async function getFcAddress(fid: number | string) {
    // get custody address from fid
    // custoday address holds fid/fc account
    
    const { users } = await neynarClient.fetchBulkUsers([Number(fid)]);
    
    const custodyAddress = users[0].custody_address;
    return getAddress(custodyAddress);
}