import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TwoColumnLayout from "@/components/ui/twoColLayout";
import { cn } from "@/lib/utils";
import { getFrameMetadata } from "frog/next";
import { Metadata } from "next";

import { homePageIntroText } from "@/app/utils/consts";
import { ImageContainer, ImageProps, ImagesProps } from "@/components/ui/ImageContainer";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
  );
  return {
    other: frameTags,
  };
}

const imagesGrid: ImageProps[] = [
  { src: "/dm-vec.png", alt: "Delegate Match Mark",  },
  { src: "/sun-vec.png", alt: "Optimism Sun like image",  },
];

const imagesSingle: ImageProps[] = [
  { src: "/logo-dm.png", alt: "Delegate Match" },
  { src: "/logo-rg.png", alt: "Raidguild"},
];



const GridImages: React.FC<ImagesProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
      {images.map((image, index) => (
        <ImageContainer
          key={index}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </div>
  );
};

const SingleImages: React.FC<ImagesProps> = ({ images }) => {
  return (
    <>
      {images.map((image, index) => (
        <ImageContainer
          key={index}
          src={image.src}
          alt={image.alt}
          padding={32}
        />
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
    <div className="text-left h-full p-12 border border-gray-200 rounded-lg">
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
  return <TwoColumnLayout col1={<LogoColumn />} col2={<IntroText />} />;
}
