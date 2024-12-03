import getAttestations from "./attestations";
import { delegateAnswers } from "@/app/utils/delegateAnswers";

import { DelegateAnswers, RankedDelegate } from "@/app/utils/interfaces";
import { surveyQuestions } from "@/app/utils/surveyQuestions";
import _ from "lodash";
import { DecodedAttestation } from "@/app/utils/interfaces";

  
  export default async function rankDelegates(
    fid: string | number, 
  ): Promise<RankedDelegate[]>
   {

    console.log('Ranking delegates for fid: ' + fid);

    // get attestations
    const attestations = await getAttestations(fid);

    // get latest only
    attestations.slice(-surveyQuestions.length);


    const decodedAttestations = attestations.map(a => {
      return _.reduce(JSON.parse(a.decodedDataJson), (acc: { [key: string]: string }, item) => {
        if (item.name === 'promptStatement' || item.name === 'choiceStatement') {
          acc[_.get(item, 'name')] = _.get(item, 'value.value');
        }
        return acc;
      }, {});
    });


    const totalQuestions = Object.keys(surveyQuestions).length;
  
    // Calculate the score and percentage for each delegate
    const scores = delegateAnswers.map((delegate: DelegateAnswers) => {
      
      let score = 0;
      _.map(decodedAttestations, (attestation: DecodedAttestation, questionIndex: number) => {
        if (attestation.promptStatement === surveyQuestions[questionIndex].prompt && 
          attestation.choiceStatement === surveyQuestions[questionIndex].choices[delegate.responses[questionIndex]]
        ) {
          score++;
        }
      });
      const matchPercentage = (score / totalQuestions) * 100;
      return { delegateID: delegate.delegateID, matchPercentage: Math.ceil(matchPercentage * 100) / 100 };
    });
  
    // Sort delegates by matchPercentage in descending order
    scores.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
    // Return array of delegateIDs and matchPercentages in ranked order
    return scores;
  }