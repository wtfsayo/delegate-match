import "@/styles/global.css";
import { Sora } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const fontSans = Sora({
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
          "min-h-screen bg-background font-sans antialiased bg-[url('/bg-ray.png')] bg-contain bg-no-repeat bg-center md:mt-20",
          fontSans.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
