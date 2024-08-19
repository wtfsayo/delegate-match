import { gql } from "graphql-request";

export const GET_ATTESTATIONS = gql`
query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      attester
      recipient
      refUID
      revoked
      decodedDataJson
    }
  }`;

export const GET_USER_BY_ID = gql`
query GetUserByFid($userId: String!) {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}, userId: {_eq: $userId}}, blockchain: ethereum}
  ) {
    Social {
      userId
      userAddress
      profileName
      profileDisplayName
    }
  }
}`;