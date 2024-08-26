import { getFrameMetadata } from "frog/next";
import { Metadata } from "next";
import TwoColumnLayout from "@/components/ui/twoColLayout";
import getAttestations from "@/app/actions/attestations";
import rankDelegates from "@/app/actions/matches";
import { congratsText, imagesSingle } from "@/app/utils/consts";
import { ImageContainer, ImagesProps } from "@/components/ui/ImageContainer";
import { DelegateCard } from "@/components/ui/delegateCard";
import Image from "next/image";
import Link from "next/link";

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

  console.log(attestations, "from matches page for fid", fid);

  if (!attestations.length) {
    return <main>{`No attestations found for this fid`}</main>;
  }

  return (
    <TwoColumnLayout col2={<MatchColumn fid={fid} />} col1={<CongratsText />} />
  );
}

const MatchColumn: React.FC<{ fid: string }> = async ({ fid }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <ImageContainer src={imagesSingle[0].src} alt={imagesSingle[0].alt} />
      <DelegateMatches fid={fid} />
    </div>
  );
};

const DelegateMatches: React.FC<{ fid: string }> = async ({ fid }) => {
  const delegateMatches = await rankDelegates(fid!);
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      {delegateMatches.map((delegate) => (
        <DelegateCard delegate={delegate} />
      ))}
    </div>
  );
};

const CongratsText = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="flex flex-col text-left bg-white h-full p-4 sm:p-8 md:p-12 lg:p-16 border border-gray-200 rounded-lg gap-6">
        <span>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {congratsText[0]}
          </h2>

          {congratsText.slice(1, 3).map((text, index) => (
            <p key={index} className="leading-7 [&:not(:first-child)]:mt-4">
              {text}
            </p>
          ))}
        </span>
        <span>
          <h2 className="scroll-m-20 pb-2 text-3xl mt-3 font-semibold tracking-tight mt-3">
            {congratsText[3]}
          </h2>

          {congratsText.slice(4, 6).map((text, index) => (
            <p key={index} className="leading-7 [&:not(:first-child)]:mt-4">
              • {text}
            </p>
          ))}
        </span>

        <span>
          <h2 className="scroll-m-20 pb-2 text-3xl mt-3 font-semibold tracking-tight mt-3">
            {congratsText[6]}
          </h2>

          {congratsText.slice(7, 10).map((text, index) => (
            <p key={index} className="leading-7 [&:not(:first-child)]:mt-4">
              {index + 1}. {text}
            </p>
          ))}
        </span>
        <p className="italic text-sm mt-6">
          Disclaimer: This is a proof of concept for representation purposes only. Please conduct your own research.
        </p>
        <span className="mt-6">
          <Link href="https://warpcast.com/delegatematch/0xfca020d4">
            <Image src="/warpcast.png" alt="warpcast" width={42} height={42}/>
          </Link>
        </span>
      </div>
      <ImageContainer src={imagesSingle[1].src} alt={imagesSingle[1].alt} />
    </div>
  );
};
