import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Divider, ThemeProvider,
} from '@mui/material';
import {ascentTheme} from "@javascript/components/ascentColors";
import RocketLaunch from '@mui/icons-material/RocketLaunch';

export default function AscentsSummary({ascentCounts}) {
    const summary = ascentCounts.map(ascentCount => (
        {
            title: ascentCount.title,
            value: ascentCount.value,
            icon: (
                <ThemeProvider theme={ascentTheme}>
                    <RocketLaunch
                        color={ascentCount.color}
                        fontSize="large"
                    />
                </ThemeProvider>
            ),
        }
    ));

    return (
        <Box>
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
                            <CardContent sx={{flex: 1}}>
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
                                {item.change &&
                                    <Typography
                                        variant="body2"
                                        color={
                                            item.change.startsWith('+') ? 'success.main' : 'error.main'
                                        }
                                    >
                                        {item.change}
                                    </Typography>
                                }
                            </CardContent>
                            <Box sx={{ml: 2}}>{item.icon}</Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
