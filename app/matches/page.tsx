import TwoColumnLayout from "@/components/ui/twoColLayout";
import { getFrameMetadata } from "frog/next";
import { Metadata } from "next";

import {
  homePageIntroText,
  imagesSingle,
  imagesGrid,
} from "@/app/utils/consts";
import { ImageContainer, ImagesProps } from "@/components/ui/ImageContainer";

import { Analytics } from "@vercel/analytics/react";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`,
  );
  return {
    other: frameTags,
  };
}

const GridImages: React.FC<ImagesProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full w-full">
      {images.map((image, index) => (
        <ImageContainer key={index} src={image.src} alt={image.alt} />
      ))}
    </div>
  );
};

const SingleImages: React.FC<ImagesProps> = ({ images }) => {
  return (
    <>
      {images.map((image, index) => (
        <ImageContainer key={index} src={image.src} alt={image.alt} />
      ))}
    </>
  );
};

const LogoColumn: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <GridImages images={imagesGrid} />
      <SingleImages images={imagesSingle} />
    </div>
  );
};

const IntroText = () => {
  return (
    <div className="text-left bg-white h-full p-4 sm:p-8 md:p-12 lg:p-16 border border-gray-200 rounded-lg">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {homePageIntroText[0]}
      </h2>

      {homePageIntroText.slice(1).map((text, index) => (
        <p key={index} className="leading-7 [&:not(:first-child)]:mt-6">
          {text}
        </p>
      ))}
    </div>
  );
};

export default function Home() {
  return
  (<>
    <Analytics />
    <TwoColumnLayout col1={<LogoColumn />} col2={<IntroText />} />
  </>);
}
