interface DelegateAnswers {
    delegateID: number;
    responses: Record<number, number>;
  }
  
  function generateDelegateData(
    numDelegates: number = 15,
    numQuestions: number = 5,
    minAnswer: number = 0,
    maxAnswer: number = 3
  ): DelegateAnswers[] {
    const delegates: DelegateAnswers[] = [];
  
    for (let i = 0; i < numDelegates; i++) {
      const delegate: DelegateAnswers = {
        delegateID: i,
        responses: {}
      };
  
      for (let j = 0; j < numQuestions; j++) {
        delegate.responses[j] = Math.floor(Math.random() * (maxAnswer - minAnswer + 1)) + minAnswer;
      }
  
      delegates.push(delegate);
    }
  
    return delegates;
  }

  export const customData = generateDelegateData(10, 3, 1, 5);