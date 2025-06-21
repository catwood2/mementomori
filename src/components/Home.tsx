import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, useTheme, useMediaQuery, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PlayCircleOutline, FormatQuote, AddCircleOutline, Search, Chat, PhotoCamera, HourglassEmpty } from '@mui/icons-material';

interface Feature {
  icon: React.ReactElement;
  label: string;
  description: string;
  tabIndex?: number;
  action?: () => void;
}

const fallbackQuotes = [
  '"The obstacle is the way. - Marcus Aurelius"',
  '"We suffer more in imagination than in reality. - Seneca"',
  '"It is not things themselves that disturb us, but our opinions about them. - Epictetus"',
  '"He who fears death will never do anything worth of a man who is alive. - Seneca"',
  '"You have power over your mind—not outside events. Realize this, and you will find strength. - Marcus Aurelius"',
];

const getRandomQuote = () => {
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
};

interface HomeProps {
  onFeatureSelect?: (tabIndex: number) => void;
  deathDate: string | null;
  onSetDeathDate: () => void;
}

const Home: React.FC<HomeProps> = ({ onFeatureSelect, deathDate, onSetDeathDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [quote, setQuote] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);
  
  const baseFeatures: Feature[] = [
    {
      icon: <PlayCircleOutline fontSize="large" sx={{ color: '#FFD700' }} />,
      label: 'Featured Videos',
      description: 'Watch Stoic talks and interviews.',
      tabIndex: 5,
    },
    {
      icon: <PhotoCamera fontSize="large" sx={{ color: '#FFD700' }} />,
      label: 'Stoic Photos',
      description: 'Share and browse inspiring images.',
      tabIndex: 6,
    },
    {
      icon: <FormatQuote fontSize="large" sx={{ color: '#9B2C2C' }} />,
      label: 'Live Feed',
      description: 'See the latest Stoic quotes.',
      tabIndex: 1,
    },
    {
      icon: <Search fontSize="large" sx={{ color: '#FFD700' }} />,
      label: 'Find Quotes',
      description: 'Search timeless wisdom.',
      tabIndex: 2,
    },
    {
      icon: <AddCircleOutline fontSize="large" sx={{ color: '#9B2C2C' }} />,
      label: 'Add Quote',
      description: 'Share your own insight.',
      tabIndex: 3,
    },
    {
      icon: <Chat fontSize="large" sx={{ color: '#FFD700' }} />,
      label: 'Stoic Advisor',
      description: 'Ask the Stoic AI for advice.',
      tabIndex: 4,
    },
  ];

  const features = [...baseFeatures];
  if (!deathDate) {
    features.push({
      icon: <HourglassEmpty fontSize="large" sx={{ color: '#9B2C2C' }} />,
      label: 'When I Die',
      description: 'Calculate and contemplate your final day.',
      action: onSetDeathDate
    });
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pt: isMobile ? 4 : 8,
        px: 2,
      }}
    >
      {/* Hero Section */}
      <Typography
        variant={isMobile ? 'h3' : 'h2'}
        sx={{
          fontWeight: 800,
          letterSpacing: 2,
          color: '#9B2C2C',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Memento Mori
      </Typography>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        sx={{
          color: '#FFD700',
          mb: 3,
          textAlign: 'center',
          fontWeight: 400,
          whiteSpace: 'pre-line',
        }}
      >
        {'Remember you must die.\nLive with intention.'}
      </Typography>
      <Button
        variant="contained"
        size={isMobile ? 'medium' : 'large'}
        sx={{
          background: 'linear-gradient(45deg, #9B2C2C 30%, #FFD700 90%)',
          color: 'white',
          fontWeight: 700,
          px: 4,
          py: 1.5,
          borderRadius: 3,
          mb: 5,
          boxShadow: 3,
          '&:hover': {
            background: 'linear-gradient(45deg, #FFD700 30%, #9B2C2C 90%)',
          },
        }}
        onClick={() => onFeatureSelect?.(1)}
      >
        Begin Your Stoic Journey
      </Button>

      {/* Quote of the Day */}
      <Paper
        elevation={4}
        sx={{
          bgcolor: 'rgba(30,30,30,0.95)',
          borderRadius: 3,
          px: isMobile ? 2 : 5,
          py: isMobile ? 2 : 3,
          mb: 5,
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          sx={{ color: 'white', fontStyle: 'italic', mb: 1 }}
        >
          {quote}
        </Typography>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Quote of the Day
        </Typography>
      </Paper>

      {/* Feature Previews */}
      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center" sx={{ mb: 6, maxWidth: 1000 }}>
        {features.map((feature) => (
          <Grid item xs={6} sm={4} md={2.4} key={feature.label}>
            <Paper
              elevation={2}
              sx={{
                p: isMobile ? 1.5 : 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(30,30,30,0.85)',
                borderRadius: 2,
                minHeight: 120,
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  bgcolor: 'rgba(155,44,44,0.15)',
                },
              }}
              onClick={() => feature.action ? feature.action() : onFeatureSelect?.(feature.tabIndex!)}
            >
              {feature.icon}
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 700, color: '#9B2C2C' }}>
                {feature.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', mt: 0.5 }}>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* About/Footer */}
      <Box sx={{ mt: 'auto', mb: 3, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
        <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="body2" sx={{ mb: 1 }}>
          Inspired by the wisdom of the Stoics. Built for modern reflection.
        </Typography>
        <Typography variant="body2">
          <a href="https://github.com/catwood2/mementomori" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 500 }}>
            GitHub
          </a>
          {`  |  `}
          <a href="mailto:catwood2@gmail.com" style={{ color: '#9B2C2C', textDecoration: 'none', fontWeight: 500 }}>
            Contact
          </a>
          {`  |  `}
          <span
            style={{ color: '#FFD700', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setPrivacyOpen(true)}
          >
            Privacy
          </span>
        </Typography>
        <Dialog open={privacyOpen} onClose={() => setPrivacyOpen(false)}>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This app does <b>not</b> store any user-related data. All code is open source and you can verify this on GitHub. Your privacy is fully respected.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPrivacyOpen(false)} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Home; 