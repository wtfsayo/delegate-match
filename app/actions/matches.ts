import getAttestations from "./attestations";
import { delegateAnswers } from "@/app/utils/delegateAnswers";

import { DelegateAnswers, RankedDelegate } from "@/app/utils/interfaces";
import { surveyQuestions } from "@/app/utils/surveyQuestions";


  
  export default async function rankDelegates(
    fid: string | number, 
  ): Promise<RankedDelegate[]> {


    // get attestations
    const attestations = await getAttestations(fid);

    const decodedAttestations = attestations.map(a => JSON.parse(a.decodedDataJson));

    return decodedAttestations;

    // const totalQuestions = Object.keys(surveyQuestions).length;
  
    // // Calculate the score and percentage for each delegate
    // const scores = delegateAnswers.map((delegate: DelegateAnswers) => {
    //   let score = 0;
    //   for (const [question, answer] of Object.entries(inputAnswers)) {
    //     const q = Number(question);
    //     if (delegate.responses[q] === answer) {
    //       score++;
    //     }
    //   }
    //   const matchPercentage = (score / totalQuestions) * 100;
    //   return { delegateID: delegate.delegateID, matchPercentage };
    // });
  
    // // Sort delegates by matchPercentage in descending order
    // scores.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
    // // Return array of delegateIDs and matchPercentages in ranked order
    // return scores;
  }