import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import getAttestations from '@/app/actions/attestations'

export default async function Page({ params }: { params: { fid: string } }) {
  const fid = params.fid;
  const attestations = await getAttestations(fid);
  if(!attestations) {
    return (
      <main>
        {`No attestations found for this fid`}
      </main>
    )
  }
  return (
    <div>
      {`Your farcaster ID is ${params.fid} and you have ${attestations.length} attestations`}
    </div>
  )
}

