/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

import { Box, Heading, vars, Image, Text, VStack, HStack } from "@/app/utils/ui";

import { surveyQuestions } from "@/app/utils/surveyQuestions";
import { multiAttest } from "@/app/actions/attest";
import getAttestations from "@/app/actions/attestations";
import rankDelegates from "@/app/actions/matches";
import { RankedDelegate } from "@/app/utils/interfaces";
import { match } from "assert";

const neynarKey = process.env.NEYNAR_API_KEY ?? "NEYNAR_FROG_FM";

interface State {
  currentIndex: number;
  responses: Record<number, number>;
}

const app = new Frog<{ State: State }>({
  title: "Delegate Match",
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: neynarKey }),
  secret: process.env.FROG_SECRET ?? "FROG_SECRET",
  verify: true,
  ui: { vars },
  initialState: {
    currentIndex: 0,
    responses: {},
  },
});

const getFrameImage = (title: string) => {
  return (
    <Box grow alignVertical="center" alignHorizontal="center">
      <Image src="/bg.png" objectFit="cover" width="100%" height="100%" />
      <Box position="absolute" textAlign="center" margin="64">
        <Heading size="24" align="center" wrap="balance">
          {title}
        </Heading>
      </Box>
    </Box>
  );
};

const getMatchesFrameImage = (title: string, matches: RankedDelegate[]) => {
  return (
    <Box grow alignVertical="center" alignHorizontal="center">
      <Image src="/bg.png" objectFit="cover" width="100%" height="100%" />
      <Box position="absolute" textAlign="center" marginTop="64" marginLeft="64" marginRight="0" gap="16" paddingTop="32">
        <Heading size="24" align="center" wrap="balance">
          {title}
        </Heading>
        <HStack gap="32">
          {matches.map((match, index) =>
            <Box gap="8" bottom="48" alignVertical="center" alignHorizontal="center">
              <Image src={`https://api.ensdata.net/media/avatar/${match.delegateID}`} borderRadius="256" width="80" height="80" />
              <Text>{match.delegateID}</Text>
              <Text>{Math.ceil(match.matchPercentage * 100)/100}%</Text>
            </Box>)}
        </HStack>
      </Box>
    </Box>
  );
};


app.frame("/", (c) => {
  return c.res({
    action: "/0",
    image: getFrameImage("Start the survey"),
    intents: [<Button>Start</Button>],
  });
});

surveyQuestions.forEach((question, qid) => {
  app.frame(`/${qid}`, async (c) => {

    let state;

    const { buttonValue, deriveState, frameData } = c;
    const fid = frameData?.fid ?? 0;
    const attestations = await getAttestations(fid);

    if (attestations.length > 0) {
      console.log(attestations);

      const matches = await rankDelegates(fid!);

      const shownMatches = matches.slice(0, 3);

      return c.res({
        image: getMatchesFrameImage("We found recommedations for you", shownMatches),
        intents: [
          <Button.Redirect location={`https://delegate-match.vercel.app/matches/${fid}`}>
            See All
          </Button.Redirect>
        ],
      });
    }

    if (buttonValue) {
      state = deriveState((previousState) => {
        previousState.currentIndex = qid;
        previousState.responses[qid - 1] = Number(buttonValue);
      });
    }

    return c.res({
      action:
        qid < surveyQuestions.length - 1 ? String(`/${qid + 1}`) : "/attest",
      image: getFrameImage(question.prompt),
      intents: question.choices.map((choice: string, index: number) => (
        <Button value={String(index)}>{choice}</Button>
      )),
    });
  });
});


app.frame("/attest", async (c) => {
  const { buttonValue, deriveState, frameData } = c;
  const fid = frameData?.fid;

  let state: State;
  let attestations;

  if (buttonValue) {
    state = deriveState((previousState) => {
      previousState.currentIndex = Object.keys(previousState.responses).length;
      previousState.responses[Object.keys(previousState.responses).length] =
        Number(buttonValue);
    });

    const statements = Object.entries(state.responses).map(([question, answer]) => {
      const q = Number(question);
      return {
        promptStatement: surveyQuestions[q].prompt,
        choiceStatement: surveyQuestions[q].choices[answer],
      };
    });



    attestations = await multiAttest({
      statements,
      fid: Number(fid),
    });

    console.log({ attestations, statements });
  }

  if (!attestations) {
    return c.res({
      image: getFrameImage("Loading"),
      intents: [
        <Button.Reset>
          Refresh
        </Button.Reset>,
      ],
    });
  }

  const matches = await rankDelegates(fid!);

  console.log({ matches });

  return c.res({
    image: getFrameImage("We found recommedations for you"),
    intents: [
      <Button.Redirect location={`https://delegate-match.vercel.app/matches/${fid}`}>
        See All
      </Button.Redirect>
    ],
  })
});

// create castAction for sharing


devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
