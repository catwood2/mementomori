import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Tabs, Tab } from '@mui/material';
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';

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
        <Box sx={{ py: 3 }}>
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
    setTabValue(0); // Switch to quotes list after adding
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Quotes" />
            <Tab label="Add Quote" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <QuoteList key={refreshTrigger} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <QuoteForm onQuoteAdded={handleQuoteAdded} />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;
