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