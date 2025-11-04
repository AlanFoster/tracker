import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function ReportSummary() {
    const summary = [
        {
            title: 'Total Climbs',
            value: '$25,400',
            change: '+8.5%',
            icon: <AttachMoneyIcon color="success" fontSize="large" />,
        },
        {
            title: 'New Customers',
            value: '342',
            change: '+12%',
            icon: <PeopleIcon color="primary" fontSize="large" />,
        },
        {
            title: 'Session Time',
            value: '4m 23s',
            change: '-5%',
            icon: <AccessTimeIcon color="warning" fontSize="large" />,
        },
        // {
        //     title: 'Growth Rate',
        //     value: '14.7%',
        //     change: '+3.2%',
        //     icon: <TrendingUpIcon color="secondary" fontSize="large" />,
        // },
    ];

    return (
        <Box sx={{ flexGrow: 1, mt: 3 }}>
            <Grid container spacing={3}>
                {summary.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.title}>
                        <Card
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: 3,
                                boxShadow: 3,
                            }}
                        >
                            <CardContent sx={{ flex: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {item.title}
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {item.value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={
                                        item.change.startsWith('+') ? 'success.main' : 'error.main'
                                    }
                                >
                                    {item.change}
                                </Typography>
                            </CardContent>
                            <Box sx={{ ml: 2 }}>{item.icon}</Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
