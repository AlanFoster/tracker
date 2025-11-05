import React from 'react'
import {useContent} from '@thoughtbot/superglue'
import ShareButton from '@javascript/components/ShareButton'
import {colorsAsEmojis} from "@javascript/components/Emoji";
import {AscentBlockChart} from "@javascript/components/AscentBlocks";
import ReportSummary from "./AscentsSummary";
import {Layout} from "@javascript/components";
import {Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Link, Stack, Typography} from '@mui/material';

export default function SessionsShow() {
    const {session, backPath} = useContent() as any

    return (
        <Layout>
            <Stack spacing={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="inherit"
                        href={backPath}
                    >
                        Sessions
                    </Link>
                    <Typography sx={{color: 'text.primary'}}>
                        Session
                    </Typography>
                </Breadcrumbs>

                <Typography variant='h4'>
                    Overview
                </Typography>

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <ReportSummary
                        ascentCounts={session.summary.ascentCounts}
                    />
                </Box>


                <Typography variant='h5'>
                    {session.title}
                </Typography>

                <Card>
                    <CardContent sx={{textAlign: 'center'}}>
                        <AscentBlockChart ascents={session.ascents}/>
                    </CardContent>
                </Card>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant='contained'
                        href={session.newAscentPath}
                    >
                        New Ascent
                    </Button>
                    <ShareButton onShare={() => colorsAsEmojis(session.ascents.map(ascent => ascent.color))}/>
                </Stack>
            </Stack>
        </Layout>
    )
}
