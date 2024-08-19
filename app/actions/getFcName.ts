import { getAddress } from "viem";
import { airstackClient } from "../utils/clients";
import { GET_USER_BY_ID } from "../utils/queries";
import { AirstackUserQueryInterface } from "../utils/interfaces";
import _ from "lodash";

export default async function getFcName(fid: number | string) {
    
    const user: AirstackUserQueryInterface = await airstackClient.request(GET_USER_BY_ID, {userId: String(fid)})  
    const profileName = _.get(user, 'Socials.Social[0].profileName');
    const profileDisplayName = _.get(user, 'Socials.Social[0].profileDisplayName');

    return {
        profileDisplayName, profileName
    }
}