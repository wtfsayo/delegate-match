import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'

export default function Page({ params }: { params: { fid: string } }) {
  return (
    <div>
      {`Your farcaster ID is ${params.fid}`}
    </div>
  )
}

