import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Tabs, Tab, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';
import LiveFeed from './components/LiveFeed';
import DayIDieButton from './components/DayIDieButton';
import StoicAdvisor from './components/StoicAdvisor';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          color: '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': {
            color: '#90caf9',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#90caf9',
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deathDate, setDeathDate] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedDeathDate = localStorage.getItem("deathDate");
    if (savedDeathDate) {
      setDeathDate(savedDeathDate);
    }
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuoteAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeathDateSet = (date: string) => {
    setDeathDate(date);
    setShowDialog(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100%', 
        height: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        color: 'text.primary',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.default',
          zIndex: 900,
          pt: isMobile ? 6 : 0,
          flexShrink: 0
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered={!isMobile}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontSize: isMobile ? '0.875rem' : '1.1rem',
                textTransform: 'none',
                fontWeight: 500,
                minWidth: isMobile ? 'auto' : 120,
                padding: isMobile ? '12px 8px' : '12px 16px',
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: '#90caf9',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#90caf9',
              },
            }}
          >
            <Tab label="Live Feed" />
            <Tab label="Find Quotes" />
            <Tab label="Add Quote" />
            <Tab label="Stoic Advisor" />
          </Tabs>
        </Box>

        <Box sx={{ 
          position: 'fixed', 
          top: isMobile ? 8 : 8, 
          left: isMobile ? 8 : 20, 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {deathDate ? (
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: isMobile ? '0.875rem' : '1rem',
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
                padding: '4px 8px',
                borderRadius: 1
              }}
            >
              My number is up: {deathDate}
            </Typography>
          ) : (
            <Button
              variant="outlined"
              onClick={() => setShowDialog(true)}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                fontSize: isMobile ? '0.875rem' : '1rem',
                padding: isMobile ? '4px 8px' : '6px 16px',
                backgroundColor: 'rgba(18, 18, 18, 0.8)'
              }}
            >
              when i die
            </Button>
          )}
        </Box>

        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          pt: isMobile ? 1 : 2,
          backgroundColor: 'background.default',
          position: 'relative'
        }}>
          <TabPanel value={tabValue} index={0}>
            <LiveFeed />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <QuoteList key={refreshTrigger} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <QuoteForm onQuoteAdded={handleQuoteAdded} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <StoicAdvisor />
          </TabPanel>
        </Box>

        {showDialog && (
          <DayIDieButton 
            onDeathDateSet={handleDeathDateSet}
            onClose={() => setShowDialog(false)}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
