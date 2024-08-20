"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ImageProps {
  src: string;
  alt: string;
  padding?: number;
}

export interface ImagesProps {
  images: ImageProps[];
}

export const ImageContainer: React.FC<ImageProps> = ({ src, alt, padding }) => {
  return (
    <div
      className={cn(
        "relative bg-white border border-gray-200 rounded-md w-full h-full flex justify-center items-center",
        padding ? `p-${padding}` : `p-16`
      )}
    >
      <Image src={src} alt={alt} className="object-cover" />
    </div>
  );
};
