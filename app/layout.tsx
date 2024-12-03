import "@/styles/global.css";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";


export const metadata: Metadata = {
  title: "Delegate Match",
  description: "Delegate Match",
  openGraph: {
    type: "website",
    url: "https://delegatematch.xyz",
    title: "Delegate Match",
    description:
      "Find the perfect delegate for your OP tokens in the Optimism ecosystem.",
    images: [
      {
        url: "/twitter-card.png",
        width: 1200,
        height: 630,
        alt: "Delegate Match - The Future of Delegation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Delegate_Match",
    creator: "@suede0619",
    title: "Delegate Match",
    description:
      "Find the perfect governance delegate for your OP tokens in the Optimism ecosystem.",
    images: "/twitter-card.png",
  },
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
        <Analytics />
        {children}
      </body>
    </html>
  );
}
