/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
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

const getFrameImageByUrl = (title: string, url: string) => {
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



app.image("/matchImage/:fid", async (c) => {
  const fid = c.req?.param()?.fid ?? "0";
  const { profileDisplayName, profileName } = await getFcName(fid);

  console.log({ fid, profileDisplayName, profileName }, "from matchImage frame for fid", fid);
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
      image: getFrameImage("Find your matches... try refreshing the frame"),
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
              <Box gap="8" alignVertical="center" alignHorizontal="center" key={match?.delegateID?.toString()}>
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
      <Button action="/education/0" key="education">Education</Button>,
      <Button action="/start" key="start">Find Matches</Button>,
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
      intents: [<Button key="show-matches">Show Matches</Button>],
    });
  }

  return c.res({
    action: "/quest/0",
    image: getFrameImageByUrl(
      "Answer 11 questions about your key priorities and values, and we will match you with an OP delegate.",
      "/bg-intro.png"
    ),
    intents: [<Button key="start">Start</Button>],
  });
});

surveyQuestions.forEach((question, qid) => {
  app.frame(`/quest/${qid}`, (c) => {

    const { buttonValue, deriveState } = c;

    if (buttonValue) {
      deriveState((previousState) => {
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
        <Button value={String(index)} key={index}>{choice}</Button>
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
        <Button action={index > 0 ? "/education/" + (index - 1) : "/"} key="action1">
          Back
        </Button>,
        <Button
          action={
            index + 1 < educationQuest.length
              ? "/education/" + (index + 1)
              : "/start"
          }
          key="action2"
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

  const state: State = deriveState((previousState) => {
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

  console.log(statements, "from attest frame by ", fid);

  const attestationIds = await multiAttest({
    statements,
    fid: Number(fid),
  });

  if (attestationIds && attestationIds.length > 0) {
    return c.res({
      image: "/matchImage/" + fid,
      intents: [
        <Button action="/existing" key="refresh">Refresh</Button>,
        <Button.Redirect location={`https://delegatematch.xyz/matches/${fid!}`} key={`match-${fid}`}>
          See All
        </Button.Redirect>,
      ],
    });
  }

  return c.res({
    image: "/load3.gif",
    action: "/existing",
    intents: [<Button key="refresh">Refresh</Button>],
  });
});

app.frame("/existing", async (c) => {
  const { frameData } = c;
  const fid = frameData?.fid;

  return c.res({
    image: "/matchImage/" + fid,
    intents: [
      <Button.Redirect location={`https://delegatematch.xyz/matches/${fid!}`} key="see-all">
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
