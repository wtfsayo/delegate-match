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

export interface AirstackUserQueryInterface {
    Socials: {
      Social: {
        userId: string;
        userAddress: string;
      }[];
    };
}


// Optimism Agora API Intefaces

interface TopIssue {
  type: string;
  value: string;
}


interface VotingPower {
  total: string;
  direct: string;
  advanced: string;
}

interface StatementPayload {
  for: string;
  discord: string;
  twitter: string;
  topIssues: TopIssue[];
  delegateStatement: string;
  mostValuableProposals: string[];
  leastValuableProposals: string[];
  openToSponsoringProposals: string;
}

export interface DelegateStatement {
  signature: string;
  payload: StatementPayload;
  twitter: string;
  discord: string;
  created_at: string;
  updated_at: string;
  warpcast: string | null;
  endorsed: boolean;
}

export interface DelegateProfile {
  address: string;
  citizen: boolean;
  votingPower: VotingPower;
  votingPowerRelativeToVotableSupply: number;
  votingPowerRelativeToQuorum: number;
  proposalsCreated: string;
  proposalsVotedOn: string;
  votedFor: string;
  votedAgainst: string;
  votedAbstain: string;
  votingParticipation: number;
  lastTenProps: string;
  numOfDelegators: string;
  statement: DelegateStatement;
}
