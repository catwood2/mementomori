import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Tabs, Tab } from '@mui/material';
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';
import LiveFeed from './components/LiveFeed';
import MementoCalendar from './components/MementoCalendar';
import DayIDieButton from './components/DayIDieButton';

const theme = createTheme({
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
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuoteAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="Live Feed" />
            <Tab label="Find Quotes" />
            <Tab label="Add Quote" />
            <Tab label="Memento Mori" />
          </Tabs>
        </Box>
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
          <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <MementoCalendar birthDate={new Date()} />
          </Box>
        </TabPanel>
        <DayIDieButton />
      </Box>
    </ThemeProvider>
  );
}

export default App;
