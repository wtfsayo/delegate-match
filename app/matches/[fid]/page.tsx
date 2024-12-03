import { getFrameMetadata } from "frog/next";
import { Metadata } from "next";
import TwoColumnLayout from "@/components/ui/twoColLayout";
import getAttestations from "@/app/actions/attestations";
import rankDelegates from "@/app/actions/matches";
import { congratsText, imagesSingle } from "@/app/utils/consts";
import { ImageContainer } from "@/components/ui/ImageContainer";
import { DelegateCard } from "@/components/ui/delegateCard";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 1000;
export const dynamicParams = true;

import { Analytics } from "@vercel/analytics/react";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`,
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
      <Analytics />
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
        <DelegateCard delegate={delegate} key={delegate?.delegateID?.toString()} />
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
          <h2 className="scroll-m-20 pb-2 text-3xl mt-3 font-semibold tracking-tight">
            {congratsText[3]}
          </h2>

          {congratsText.slice(4, 6).map((text, index) => (
            <p key={index} className="leading-7 [&:not(:first-child)]:mt-4">
              • {text}
            </p>
          ))}
        </span>

        <span>
          <h2 className="scroll-m-20 pb-2 text-3xl mt-3 font-semibold tracking-tight">
            {congratsText[6]}
          </h2>

          {congratsText.slice(7, 11).map((text, index) => (
            <p key={index} className="leading-7 [&:not(:first-child)]:mt-4">
              {index + 1}. {text}
            </p>
          ))}
        </span>
        <p className="italic text-sm mt-3">
          Disclaimer: This is a proof of concept for representation purposes
          only. Please conduct your own research.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-0 w-full mt-6 gap-2">
          <div className="flex gap-2">
            <Link href="https://warpcast.com/delegatematch" target="_blank">
              <div className="bg-[#ffffff] border-2 border-[#D0D0D0] rounded-md p-1 hover:bg-[#f8f8f8]">
                <Image
                  src="/warpcast-80.png"
                  alt="warpcast"
                  width={32}
                  height={32}
                />
              </div>
            </Link>
            <Link href="https://x.com/delegate_match" target="_blank">
              <div className="bg-[#ffffff] border-2 border-[#D0D0D0] rounded-md p-1 hover:bg-[#f8f8f8]">
                <Image
                  src="/twitter-80.png"
                  alt="twitter"
                  width={32}
                  height={32}
                />
              </div>
            </Link>
          </div>
          <div className="ml-auto">
            <Link
              href={`https://zora.co/collect/oeth:0xf918e83fa0d8615c621f498617920772ba790855/1`}
              target={`_blank`}
            >
              <div className="bg-[#FF0420] text-[#fbebcf] border-2 border-[#DFCCB0] rounded-md px-4 py-2 hover:bg-[#81837A]">
                <h2 className="text-l font-semibold">Mint Originals NFT on Zora</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ImageContainer src={imagesSingle[1].src} alt={imagesSingle[1].alt} />
    </div>
  );
};
