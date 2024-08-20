import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TwoColumnLayout from "@/components/ui/twoColLayout";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getFrameMetadata } from "frog/next";
import { Metadata } from "next";

import { homePageIntroText } from "@/app/utils/consts";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
  );
  return {
    other: frameTags,
  };
}

export const LogoColumn = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
       <AspectRatio ratio={320 / 224} className="bg-white border-1">
      <Image
        src="/dm-vec.png"
        alt="Delegate Match Mark"
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
    <AspectRatio ratio={320 / 224} className="bg-white border-1">
      <Image
        src="/sun-vec.png" 
        alt="Optimism Sun like image"
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
    </div>
    <AspectRatio ratio={320 / 224} className="bg-white border-1">
      <Image
        src="/logo-dm.png"
        alt="Delegate Match"
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
    <AspectRatio ratio={320 / 224} className="bg-white border-1">
      <Image
        src="/logo-rg.png"
        alt="Raidguild"
        fill
        className="rounded-md object-cover"
      />
    </AspectRatio>
    </div>
  )
}



export const IntroText = () => {
  return (
    <div className="text-left">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {homePageIntroText[0]}
      </h2>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {homePageIntroText[1]}
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {homePageIntroText[2]}
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {homePageIntroText[3]}
      </p>
    </div>
  );
};




export default function Home() {
  return <TwoColumnLayout col1={<LogoColumn/>} col2={<IntroText />} />;
}