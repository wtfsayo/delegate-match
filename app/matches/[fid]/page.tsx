import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
import TwoColumnLayout from "@/components/ui/twoColLayout";
import getAttestations from '@/app/actions/attestations'
import rankDelegates from '@/app/actions/matches'
import { congratsText, homePageIntroText, imagesSingle} from "@/app/utils/consts";
import { ImageContainer, ImagesProps } from "@/components/ui/ImageContainer";
import { ScrollArea } from '@/components/ui/scroll-area';


export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
  );
  return {
    other: frameTags,
  };
}

export default async function Page({ params }: { params: { fid: string } }) {
  const fid = params.fid;
  const attestations = await getAttestations(fid);

  if (!attestations.length) {
    return (
      <main>
        {`No attestations found for this fid`}
      </main>
    )
  }

  return (
    <TwoColumnLayout col2={<DelegateMatches fid={fid} />} col1={<CongratsText />} />
  )
}


const DelegateMatches: React.FC<{ fid: string }> = async ({ fid }) => {
  const delegateMatches = await rankDelegates(fid!);
  return (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4"><ol>
      {delegateMatches.map((delegate) =>
        <li><a href={`https://vote.optimism.io/delegates/${delegate.delegateID}`}>{delegate.delegateID + " : " + delegate.matchPercentage + "%"}</a></li>)}
    </ol>
    </ScrollArea>
  )
}


const CongratsText = () => {
  return (
    <div className="text-left bg-white h-full gap-6 p-16 border border-gray-200 rounded-lg">
      <>
        <h2 className="scroll-m-20 p-2 text-3xl font-semibold tracking-tight first:mt-0">
          {congratsText[0]}
        </h2>

        {congratsText.slice(1, 3).map((text, index) => (
          <p key={index} className="leading-7 [&:not(:first-child)]:mt-6">
            {text}
          </p>
        ))}
      </>
      <>
        <h2 className="scroll-m-20 pt-2 text-3xl font-semibold tracking-tight first:mt-0">
          {congratsText[3]}
        </h2>



        {congratsText.slice(4, 6).map((text, index) => (

          <p key={index} className="leading-7 [&:not(:first-child)]:mt-6">
            • {text}
          </p>

        ))}

      </>

      <>
        <h2 className="scroll-m-20 pt-2 text-3xl font-semibold tracking-tight first:mt-0">
          {congratsText[6]}
        </h2>



        {congratsText.slice(7, 10).map((text, index) => (
          <p key={index} className="leading-7 [&:not(:first-child)]:mt-6">
            {index + 1}. {text}
          </p>
        ))}


      </>

      {/* <ImageContainer
          src={imagesSingle[0].src}
          alt={imagesSingle[0].alt}
        /> */}
    </div>
  );
};

