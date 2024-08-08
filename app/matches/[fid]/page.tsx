import { getFrameMetadata } from 'frog/next'
import { Metadata } from 'next'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import getAttestations from '@/app/actions/attestations'
import rankDelegates from '@/app/actions/matches'

export default async function Page({ params }: { params: { fid: string } }) {
  const fid = params.fid;
  const attestations = await getAttestations(fid);
  const delegateMatches = await rankDelegates(fid!);
  if(attestations.length == 0) {
    return (
      <main>
        {`No attestations found for this fid`}
      </main>
    )
  }
  return (
    <div>
      {`Your farcaster ID is ${params.fid} and you have ${attestations.length} attestations`}
      <ol>
      {delegateMatches.map((delegate) => 
      <li><p>{delegate.delegateID + " : " + delegate.matchPercentage + "%"}</p></li>)}
      </ol>
    </div>
  )
}

