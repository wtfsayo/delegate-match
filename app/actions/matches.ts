interface DelegateAnswers {
    delegateID: number;
    responses: Record<number, number>;
  }
  
  interface RankedDelegate {
    delegateID: number;
    matchPercentage: number;
  }
  
  export default function rankDelegates(
    inputAnswers: Record<number, number>,
    delegates: DelegateAnswers[]
  ): RankedDelegate[] {
    const totalQuestions = Object.keys(inputAnswers).length;
  
    // Calculate the score and percentage for each delegate
    const scores = delegates.map(delegate => {
      let score = 0;
      for (const [question, answer] of Object.entries(inputAnswers)) {
        const q = Number(question);
        if (delegate.responses[q] === answer) {
          score++;
        }
      }
      const matchPercentage = (score / totalQuestions) * 100;
      return { delegateID: delegate.delegateID, matchPercentage };
    });
  
    // Sort delegates by matchPercentage in descending order
    scores.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
    // Return array of delegateIDs and matchPercentages in ranked order
    return scores;
  }