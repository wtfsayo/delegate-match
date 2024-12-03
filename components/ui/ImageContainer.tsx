import Image from "next/image";

export interface ImageProps {
  src: string;
  alt: string;
}

export interface ImagesProps {
  images: ImageProps[];
}

export const ImageContainer: React.FC<ImageProps> = ({ src, alt }) => {
  return (
    <div
      className="relative bg-white border border-gray-200 rounded-md w-full h-full flex justify-center items-center min-h-48 p-16 md:p-24"
    >
      <Image src={src} alt={alt} className="object-fit" />
    </div>
  );
};
