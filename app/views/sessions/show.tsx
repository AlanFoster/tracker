import React from 'react'
import {useContent} from '@thoughtbot/superglue'
import ShareButton from '@javascript/components/ShareButton'
import {colorsAsEmojis} from "@javascript/components/Emoji";
import {AscentBlock, AscentBlockChart} from "@javascript/components/AscentBlocks";
import ReportSummary from "@views/sessions/Summary";
import {Layout} from "@javascript/components";
import { Box } from '@mui/material';

export default function SessionsShow() {
    const {session, backPath} = useContent() as any

    return (
        <Layout>
            <div>
                <a href={backPath} data-sg-visit>← Back</a>
            </div>

            <ReportSummary/>
            <div>
                Summary
            </div>
            <ul>
                {Object.entries(session.summary.counts).map(([color, count]) => (
                    <li key={color}>{count} {color}</li>
                ))}
            </ul>

            <Box sx={{ mb: 2 }}>
                <AscentBlockChart ascents={session.ascents}>
                    <AscentBlock color='grey' href={session.newAscentPath} color='grey' title='Create new'>
                        +
                    </AscentBlock>
                </AscentBlockChart>
            </Box>

            <ShareButton onShare={() => colorsAsEmojis(session.ascents.map(ascent => ascent.color))}/>
        </Layout>
    )
}
