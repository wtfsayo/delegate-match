import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <main>
      {`What's in the frame?`}
    </main>
  )
}
