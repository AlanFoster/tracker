import React from 'react'
import {useContent} from '@thoughtbot/superglue'
import {AscentBlockChart} from "@javascript/components/AscentBlocks";
import {
    Box,
    Card,
    CardActionArea,
    CardContent, CardHeader,
    Container,
    Divider,
    Link,
    List,
    ListItem,
    Typography
} from '@mui/material';
import {Layout} from "@javascript/components";
import SessionForm from './SessionForm'
import {useAppSelector} from "@javascript/store";

export default function SessionsIndex() {
    const {sessions, newSessionPath, createSessionModal} = useContent() as any
    const validationErrors = useAppSelector((state) => state.flash.postFormErrors)

    return (
        <Layout>
            <Link
                href={newSessionPath}
                data-sg-visit
            >
                New Session
            </Link>
            <SessionForm
                sessionForm={createSessionModal.newSessionForm}
                showModal={createSessionModal.showModal}
                validationErrors={validationErrors}
            />
            <Typography variant='h5'>
                Sessions
            </Typography>
            {sessions.map(session => (
                <Card key={session.id} sx={{mb: 4}}>
                    <CardActionArea href={session.detailPath} data-sg-visit>
                        <CardHeader title={session.title} />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AscentBlockChart
                                ascents={session.ascents}
                                renderLink={false}
                            />
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
            <Link
                href={newSessionPath}
                data-sg-visit
            >
                New Session
            </Link>
        </Layout>
    )
}
