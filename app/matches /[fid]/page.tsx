'use client'
import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'


// export async function generateMetadata(): Promise<Metadata> {
//   const frameTags = await getFrameMetadata(
//     `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
//   )
//   return {
//     other: frameTags,
//   }
// }

export default function Home() {
  const { fid } = useParams();
  return (
    <div>
      {`Your farcaster ID is ${fid || "0"}`}
    </div>
  )
}
