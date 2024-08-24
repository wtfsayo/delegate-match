import "@/styles/global.css";
import { Inter, Sora } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const fontInter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const fontSora = Sora({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Delegate Match",
  description: "Delegate Match",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased bg-[url('/bg-ray.png')] bg-cover bg-no-repeat bg-center md:mt-20",
          // fontSora.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
