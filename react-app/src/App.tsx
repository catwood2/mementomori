import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import QuoteList from './components/QuoteList';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9B2C2C',
    },
    background: {
      default: '#1A1A1A',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(155, 44, 44, 0.2)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '2rem' }}>
        <QuoteList />
      </div>
    </ThemeProvider>
  );
}

export default App;
