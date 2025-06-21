import { useState, useEffect } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline, Box, Button, Typography, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, AppBar, Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';
import LiveFeed from './components/LiveFeed';
import DayIDieButton from './components/DayIDieButton';
import StoicAdvisor from './components/StoicAdvisor';
import VideoCarousel from './components/VideoCarousel';
import Home from './components/Home';
import StoicPhotos from './components/CalendarGallery';

const drawerWidth = 220;

interface MenuItem {
  label: string;
  component?: JSX.Element;
}

const menuItems: MenuItem[] = [
  { label: 'Home' },
  { label: 'Live Feed', component: <LiveFeed /> },
  { label: 'Find Quotes', component: <QuoteList /> },
  { label: 'Add Quote', component: <QuoteForm onQuoteAdded={() => {}} /> },
  { label: 'Stoic Advisor', component: <StoicAdvisor /> },
  { label: 'Featured Videos', component: <VideoCarousel /> },
  { label: 'Stoic Photos', component: <StoicPhotos /> },
];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9B2C2C' },
    secondary: { main: '#B83280' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#121212', color: '#ffffff' } } },
    MuiPaper: { styleOverrides: { root: { backgroundColor: '#1e1e1e' } } },
    MuiCard: { styleOverrides: { root: { backgroundColor: '#1e1e1e', borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' } } },
  },
});

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deathDate, setDeathDate] = useState<string | null>(null);
  const [showDeathDateDialog, setShowDeathDateDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedDeathDate = localStorage.getItem('deathDate');
    if (savedDeathDate) setDeathDate(savedDeathDate);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuClick = (idx: number) => {
    setSelectedIndex(idx);
    setMobileOpen(false);
  };
  const handleQuoteAdded = () => setRefreshTrigger(prev => prev + 1);
  const handleDeathDateSet = (date: string) => {
    setDeathDate(date);
    setShowDeathDateDialog(false);
  };
  const handleFeatureSelect = (tabIndex: number) => {
    setSelectedIndex(tabIndex);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, bgcolor: 'background.paper', height: '100%', pt: 2 }}>
      <Typography variant="h6" align="center" sx={{ mb: 2, color: '#9B2C2C', fontWeight: 700 }}>
        Memento Mori
      </Typography>
      <List>
        {menuItems.map((item, idx) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={selectedIndex === idx}
              onClick={() => handleMenuClick(idx)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(155,44,44,0.15)',
                  color: '#9B2C2C',
                  fontWeight: 700,
                },
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* AppBar for mobile hamburger */}
        {isMobile && (
          <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary' }} elevation={1}>
            <Toolbar>
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {menuItems[selectedIndex].label}
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        {/* Drawer */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid #222',
            },
            zIndex: isMobile ? theme.zIndex.drawer : undefined,
          }}
        >
          {drawer}
        </Drawer>
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isMobile ? 1 : 3,
            pt: isMobile ? 7 : 3,
            overflow: 'auto',
            width: '100%',
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Floating death date button or info */}
          <Box sx={{ position: 'fixed', top: isMobile ? 8 : 8, left: isMobile ? drawerWidth + 8 : drawerWidth + 20, zIndex: 1000 }}>
            {deathDate && (
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  backgroundColor: 'rgba(18, 18, 18, 0.8)',
                  padding: '4px 8px',
                  borderRadius: 1,
                }}
              >
                My number is up: {deathDate}
              </Typography>
            )}
          </Box>
          {/* Main content area */}
          <Box sx={{ flex: 1, width: '100%', mt: isMobile ? 2 : 0 }}>
            {selectedIndex === 0 ? <Home onFeatureSelect={handleFeatureSelect} deathDate={deathDate} onSetDeathDate={() => setShowDeathDateDialog(true)} /> : menuItems[selectedIndex].component}
          </Box>
          {showDeathDateDialog && (
            <DayIDieButton onDeathDateSet={handleDeathDateSet} onClose={() => setShowDeathDateDialog(false)} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
