/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import _ from "lodash";
import { Box, Heading, vars, Image, Text, HStack } from "@/app/utils/ui";

import { surveyQuestions } from "@/app/utils/surveyQuestions";
import { multiAttest } from "@/app/actions/attest";
import rankDelegates from "@/app/actions/matches";

import { educationQuest } from "@/app/utils/consts";
import getAttestations from "@/app/actions/attestations";
import getFcName from "@/app/actions/getFcName";
const AIRSTACK_API_KEY =
  process.env.AIRSTACK_API_KEY ?? "1a290c2e9f75c450089c3b1c7ef849c02";

interface State {
  currentIndex: number;
  responses: Record<number, number>;
}

const app = new Frog<{ State: State }>({
  title: "Delegate Match",
  assetsPath: "/",
  basePath: "/api",
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": AIRSTACK_API_KEY,
      },
    },
  },
  secret: process.env.FROG_SECRET ?? "FROG_SECRET",
  verify: true,
  ui: { vars },
  initialState: {
    currentIndex: 0,
    responses: {},
  },
});

const getFrameImage = (
  title: string,
  count?: string,
  educational?: boolean
) => {
  return (
    <Box grow alignVertical="center" alignHorizontal="center">
      <Image
        src={educational ? "/bg-red.png" : "/bg.png"}
        objectFit="cover"
        width="100%"
        height="100%"
      />
      <Box position="absolute" textAlign="center" margin="64">
        <Heading size="24" align="center" wrap="balance">
          {title}
        </Heading>
      </Box>
      {count && (
        <Box position="absolute" right="16" bottom="16">
          <Text size="12" align="center" weight="400">
            {count}
          </Text>
        </Box>
      )}
    </Box>
  );
};

const getFrameImageByUrl = (title: string, url: string, count?: number) => {
  return (
    <Box grow alignVertical="center" alignHorizontal="center">
      <Image src={url} objectFit="cover" width="100%" height="100%" />
      <Box position="absolute" textAlign="center" margin="64">
        <Heading size="24" align="center" wrap="balance">
          <br /> {title}
        </Heading>
      </Box>
    </Box>
  );
};

const getLoadingImage = () => {
  return (
    <Box grow alignVertical="center" alignHorizontal="center">
      <Image src="/bg.png" objectFit="cover" width="100%" height="100%" />
      <Box position="absolute" textAlign="center" margin="64">
        <Image src="/laod3.gif" width="64" height="64" />
      </Box>
    </Box>
  );
};

app.image("/matchImage/:fid", async (c) => {
  const fid = c.req?.param()?.fid ?? "0";
  const {profileDisplayName, profileName} = await getFcName(fid);

  console.log({fid, profileDisplayName, profileName}, "from matchImage frame for fid", fid); 
  const matches = await rankDelegates(fid);

  const shownMatches = matches.slice(0, 3);

  console.log(matches, "from matchImage frame for fid", fid);
  console.log(shownMatches, "from matchImage frame for fid", fid);

  const shouldExit = shownMatches.some((m) => {
    if (!_.isNumber(m.matchPercentage) || m.matchPercentage === 0) {
      return true;
    }
  });

  if (shouldExit) {
    return c.res({
      image: getFrameImage("Still finding matches... try refreshing the frame"),
    });
  }

  return c.res({
    image: (
      <Box grow alignVertical="center" alignHorizontal="center">
        <Image src="/bg.png" objectFit="cover" width="100%" height="100%" />
        <Box
          position="absolute"
          textAlign="center"
          marginTop="64"
          marginLeft="64"
          marginRight="0"
          gap="16"
          paddingTop="32"
        >
          <HStack gap="32">
            {shownMatches.map((match) => (
              <Box gap="8" alignVertical="center" alignHorizontal="center">
                <Image
                  src={`https://api.ensdata.net/media/avatar/${match.delegateID}`}
                  borderRadius="256"
                  width="80"
                  height="80"
                />
                <Text size="18" weight="600">
                  {_.truncate(match.delegateID, {
                    length: 15,
                    separator: "...",
                  })}
                </Text>
                <Text size="16" weight="400">
                  {match.matchPercentage ?? 0}%
                </Text>
              </Box>
            ))}
          </HStack>
        </Box>
        <Box position="absolute" right="20" bottom="20">
          <Text size="12" align="center" weight="400">
            {(profileDisplayName ?? profileName ?? fid) + "'s Delegate Matches"}
          </Text>
        </Box>
      </Box>
    ),
  });
});

app.frame("/", (c) => {
  return c.res({
    image: getFrameImageByUrl(" ", "/bg0.png"),
    intents: [
      <Button action="/education/0">Education</Button>,
      <Button action="/start">Find Matches</Button>,
    ],
  });
});

app.frame("/start", async (c) => {
  const { frameData } = c;
  const fid = frameData?.fid;

  const existingAttestations = await getAttestations(String(fid));

  if (existingAttestations.length > 0) {
    return c.res({
      action: "/existing",
      image: getFrameImage(
        "You have already answered the survey. Click 'Show Matches' to see your matches."
      ),
      intents: [<Button>Show Matches</Button>],
    });
  }

  return c.res({
    action: "/quest/0",
    image: getFrameImageByUrl(
      "Answer 11 questions aboutyour key priorities and values, and we will match you with an OP delegate.",
      "/bg-intro.png"
    ),
    intents: [<Button>Start</Button>],
  });
});

surveyQuestions.forEach((question, qid) => {
  app.frame(`/quest/${qid}`, (c) => {
    let state;

    const { buttonValue, deriveState } = c;

    if (buttonValue) {
      state = deriveState((previousState) => {
        previousState.currentIndex = qid;
        previousState.responses[qid - 1] = Number(buttonValue);
      });
    }

    return c.res({
      headers: {
        "Cache-Control": "max-age=1000",
      },
      action:
        qid < surveyQuestions.length - 1
          ? String(`/quest/${qid + 1}`)
          : "/attest",
      image: getFrameImage(
        question.prompt,
        String(qid + 1) + "/" + String(surveyQuestions.length)
      ),
      intents: question.choices.map((choice: string, index: number) => (
        <Button value={String(index)}>{choice}</Button>
      )),
    });
  });
});

educationQuest.forEach((text, index) => {
  app.frame(`/education/${index}`, (c) => {
    return c.res({
      headers: {
        "Cache-Control": "max-age=1000",
      },
      image: getFrameImage(
        text,
        String(index + 1) + "/" + String(educationQuest.length),
        true
      ),
      intents: [
        <Button action={index > 0 ? "/education/" + (index - 1) : "/"}>
          Back
        </Button>,
        <Button
          action={
            index + 1 < educationQuest.length
              ? "/education/" + (index + 1)
              : "/quest/0"
          }
        >
          {index + 1 < educationQuest.length ? "Next" : "Start"}
        </Button>,
      ],
    });
  });
});

app.frame("/attest", async (c) => {
  const { buttonValue, deriveState, frameData } = c;
  const fid = frameData?.fid;

  let state: State;
  let statements;

  state = deriveState((previousState) => {
    previousState.currentIndex = Object.keys(previousState.responses).length;
    previousState.responses[Object.keys(previousState.responses).length] =
      Number(buttonValue);
  });

  statements = Object.entries(state.responses).map(([question, answer]) => {
    const q = Number(question);
    return {
      promptStatement: surveyQuestions[q].prompt,
      choiceStatement: surveyQuestions[q].choices[answer],
    };
  });

  console.log(statements, "from attest frame by ", fid);

  const attestationIds = await multiAttest({
    statements,
    fid: Number(fid),
  });

  if (attestationIds && attestationIds.length > 0) {
    return c.res({
      image: "/matchImage/" + fid,
      intents: [
        <Button.Redirect location={`https://delegatematch.xyz/matches/${fid!}`}>
          See All
        </Button.Redirect>,
      ],
    });
  }

  return c.res({
    image: "/matchImage/" + fid,
    action: "/existing",
    intents: [<Button>Refresh</Button>],
  });
});

app.frame("/existing", async (c) => {
  const { frameData } = c;
  const fid = frameData?.fid;

  return c.res({
    image: "/matchImage/" + fid,
    intents: [
      <Button action="/existing">Refresh</Button>,
      <Button.Redirect location={`https://delegatematch.xyz/matches/${fid!}`}>
        See All
      </Button.Redirect>,
    ],
  });
});

// create castAction for sharing

devtools(app, {
  serveStatic,
});

export const GET = handle(app);
export const POST = handle(app);
