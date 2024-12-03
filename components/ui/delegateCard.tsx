import { DelegateProfile, RankedDelegate } from "@/app/utils/interfaces";
import { Card, CardContent, CardFooter, CardTitle } from "./card";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import Link from "next/link";
import numbro from "numbro";
import { Badge } from "./badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import _ from "lodash";


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

        <Card className="border border-gray-200 rounded-lg p-4 md:p-8 mt-3 w-full">
            <CardTitle className="flex flex-row items-center gap-2">
                <Avatar>
                    <AvatarImage
                        src={`https://euc.li/${delegate.delegateID}`}
                        alt={`Avatar for ${delegate.delegateID}`}
                    />
                    <AvatarFallback src='https://raw.githubusercontent.com/voteagora/agora-next/main/src/assets/tenant/optimism_delegate.svg'
                        alt={`Placeholder for ${delegate.delegateID}`} />


                </Avatar>
                <div className="flex flex-col gap-0.5 align-left items-start">
                    <span>
                        {delegate.delegateID}
                    </span>
                    <p className="text-sm text-black font-medium leading-7">
                        {(numbro(Number(delegateDetails.votingPower.total) / 10 ** 18).format({
                            average: true,
                            mantissa: 2,
                        }) + ' OP').toUpperCase()}
                    </p>
                </div>
            </CardTitle>
            <CardContent className="p-0 mt-4 w-full h-full">
            <div className="mb-4 h-full line-clamp-4">
            {delegateDetails.statement.payload.delegateStatement}</div>

                <TooltipProvider>
                    <div className="flex flex-row gap-2">

                        {delegateDetails.statement.payload.topIssues.map((issue, index) => (

                            issue.value.length > 0 ?

                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline">
                                            {_.startCase(issue.type)}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{issue.value}</p>
                                    </TooltipContent>
                                </Tooltip>
                                : <Badge variant="outline" key={index}>
                                    {_.startCase(issue.type)}
                                </Badge>
                        ))}

                    </div>
                </TooltipProvider>


            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-0 sm:mt-3 w-full mt-5 gap-2">
                <span className="gap-2 flex flex-row items-center">
                    <Avatar>
                        <AvatarImage
                            src={`/dm-vec.png`}
                        />
                    </Avatar>
                    <h2 className="font-semibold ">{delegate.matchPercentage}% Match</h2>
                </span>
                <Link href={`https://vote.optimism.io/delegates/${delegate.delegateID}`} target={`_blank`} passHref>
                    <div className="bg-white border border-gray-200 rounded-md px-4 py-2 hover:bg-slate-100 mt-5 sm:mt-0">
                        View Delegate
                    </div>
                </Link>
            </CardFooter>
        </Card>

    );
}
