import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
import { useSearchParams } from 'next/navigation'


export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  const fid = useSearchParams()?.get('fid')
  return (
    <main>
      {`Your farcaster ID is ${fid}`}
    </main>
  )
}
