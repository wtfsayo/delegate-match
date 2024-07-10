/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

import { sampleQuestions } from '../../utils/sampleQuestions';

const neynarKey = process.env.NEYNAR_API_KEY ?? 'NEYNAR_FROG_FM';

const app = new Frog({
  title: 'Delegate Match',
  assetsPath: '/',
  basePath: '/api',
  hub: neynar({ apiKey: neynarKey }),
  secret: process.env.FROG_SECRET ?? 'FROG_SECRET',
  verify: true
})


app.frame('/', (c) => {
  const { buttonValue, status, frameData } = c
  
  const fid = frameData?.fid;

  console.log(`fid: ${fid}, value: ${buttonValue}`)

  return c.res({
    action: '/0',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Start the survey
        </div>
      </div>
    ),
    intents: [
      <Button>Start</Button>,
      // status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})


sampleQuestions.forEach((question, qid) => {
  app.frame(`/${question.id}`, (c) => {
    const { buttonValue, inputText, status, frameData } = c

    console.log({
      question: question.prompt,
      choice: question.choices[Number(buttonValue)], buttonValue
    });

    return c.res({
      action: (qid < sampleQuestions.length-1) ? String(`/${question.id + 1}`) : '/end',
      image: (
        <div
          style={{
            alignItems: 'center',
            background:
              status === 'response'
                ? 'linear-gradient(to right, #432889, #17101F)'
                : 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 50,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {question.prompt}
          </div>
        </div>
      ),
      intents: question.choices.map((choice:string, index:number) => (
        <Button value={String(index)}>{choice}</Button>
      ))
    });
  });
});


app.frame('/end', (c) => {
  const { buttonValue, inputText, status, frameData } = c
  const fid = frameData?.fid;
  // console.log({ frameData, fid });
  console.log(`${fid} , reached the end of questionnaire`, buttonValue)
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          #{fid} , your matches await you!
        </div>
      </div>
    ),
    intents: [
      <Button.Link href="https://delegate-match.vercel.app/">See your matches</Button.Link>,
    ],
  })
})



devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
