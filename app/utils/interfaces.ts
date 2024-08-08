import { Attestation } from "@ethereum-attestation-service/eas-sdk";

export interface DelegateAnswers {
    delegateID: string;
    responses: Record<number, number>;
  }

export interface RankedDelegate {
  delegateID: string;
  matchPercentage: number;
}

export interface AttestationData extends Attestation {
  decodedDataJson: string;
}

export interface DecodedAttestation {
  promptStatement: string;
  choiceStatement: string;
}