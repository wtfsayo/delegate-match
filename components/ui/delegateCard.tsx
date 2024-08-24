import { DelegateProfile, RankedDelegate } from "@/app/utils/interfaces";
import { Card, CardContent, CardFooter, CardTitle } from "./card";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import Link from "next/link";
import { Box } from "@/app/utils/ui";

const token = process.env.OP_AGORA_API_KEY;

export const DelegateCard = async ({ delegate }: { delegate: RankedDelegate }) => {

    const delegateDetails: DelegateProfile = await fetch(`https://vote.optimism.io/api/v1/delegates/${delegate.delegateID}`, {
        method: 'GET',
        next: {
            revalidate: 60 * 60,
        },
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    return (
        
            <Card className="border border-gray-200 rounded-lg p-8">
                <CardTitle className="flex flex-row items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={`https://euc.li/${delegate.delegateID}`}
                            alt={`Avatar for ${delegate.delegateID}`}
                        />
                        <AvatarFallback src='https://raw.githubusercontent.com/voteagora/agora-next/main/src/assets/tenant/optimism_delegate.svg'
                            alt={`Placeholder for ${delegate.delegateID}`} />


                    </Avatar>
                    {delegate.delegateID}
                </CardTitle>
                <CardContent>
                    <div>{delegateDetails.statement.payload.delegateStatement.substring(0, 100) + "..."}</div>
                    <div>{delegateDetails.statement.payload.topIssues.length && delegateDetails.statement.payload.topIssues.map((issue) => issue.value).join(", ")}</div>

                </CardContent>
                <CardFooter>
                    <div>{delegate.matchPercentage}%</div>
                <Link href={`https://vote.optimism.io/delegates/${delegate.delegateID}`} passHref>
                    <div className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                        View Delegate
                    </div>
                    </Link>
                </CardFooter>
            </Card>
    
    );
}
