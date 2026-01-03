import { Layout } from '@javascript/applications/public/components/Layout';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useContent } from '@thoughtbot/superglue';
import React from 'react';

const features = [
  { title: 'Track ascents', description: 'V-Grade, and more' },
  { title: 'Sharing', description: 'Optionally share your ascents with friends.' },
  { title: 'Fast Performance', description: 'Our app loads in milliseconds.' },
  { title: 'Responsive Design', description: 'Looks great on all devices.' },
];

function App() {
  const { appName, signInPath } = useContent();

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 10,
          borderRadius: 2,
          mb: 5,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to
          {' '}
          {appName}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          A simple way to track your ascents
        </Typography>
        <Button
          component="a"
          href={signInPath}
          variant="contained"
          color="primary"
          size="large"
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid xs={12} md={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default App;
