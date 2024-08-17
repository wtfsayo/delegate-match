import { getAddress } from "viem";
import { airstackClient } from "../utils/clients";
import { GET_USER_BY_ID } from "../utils/queries";
import { AirstackUserQueryInterface } from "../utils/interfaces";
import _ from "lodash";

export default async function getFcAddress(fid: number | string) {
    
    const user: AirstackUserQueryInterface = await airstackClient.request(GET_USER_BY_ID, {userId: String(fid)})  
    const userAddress = _.get(user, 'Socials.Social[0].userAddress');
    const userId = _.get(user, 'Socials.Social[0].userId');

    if(!userAddress || String(userId) !== String(fid)) {
        throw new Error("No user address found for fid or Server Error");
    }

    return getAddress(userAddress);
}