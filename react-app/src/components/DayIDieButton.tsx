import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip,
  TextField,
  Paper,
  Stack,
} from '@mui/material';
import { Info, Close, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const MotionButton = motion(Button);
const MotionPaper = motion(Paper);

export default function DayIDieButton() {
  const [showInfo, setShowInfo] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleClose = () => {
    setIsDismissed(true);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setShowResults(true);
      setShowDatePicker(false);
    }
  };

  const calculateTimeLeft = (deathDate: Date) => {
    const now = new Date();
    const diff = deathDate.getTime() - now.getTime();
    
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    
    return { years, months, days };
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MotionButton
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setShowDatePicker(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          startIcon={<CalendarToday />}
          sx={{
            borderRadius: '50px',
            px: 3,
            py: 1.5,
            boxShadow: 3,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
            },
          }}
        >
          Day I Die
        </MotionButton>
        
        <Tooltip title="Learn more">
          <IconButton
            onClick={() => setShowInfo(true)}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Info />
          </IconButton>
        </Tooltip>

        <Tooltip title="Dismiss">
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            When will you die?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select date"
              value={selectedDate}
              onChange={handleDateSelect}
              sx={{ width: '100%', mt: 2 }}
            />
          </LocalizationProvider>
        </DialogContent>
      </Dialog>

      {showResults && selectedDate && (
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            mt: 2,
            p: 3,
            borderRadius: 2,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" color="primary">
              Time Remaining
            </Typography>
            {(() => {
              const { years, months, days } = calculateTimeLeft(selectedDate);
              return (
                <>
                  <Typography variant="h4" color="white">
                    {years} years
                  </Typography>
                  <Typography variant="h4" color="white">
                    {months} months
                  </Typography>
                  <Typography variant="h4" color="white">
                    {days} days
                  </Typography>
                </>
              );
            })()}
            <Typography variant="body2" color="text.secondary">
              Make every moment count
            </Typography>
          </Stack>
        </MotionPaper>
      )}

      <Dialog
        open={showInfo}
        onClose={() => setShowInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Day I Die
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            "Day I Die" is a unique feature that helps you reflect on your mortality and make the most of your time.
          </Typography>
          <Typography variant="body1" paragraph>
            By acknowledging our limited time, we can:
          </Typography>
          <ul>
            <li>Focus on what truly matters</li>
            <li>Make better decisions about how we spend our time</li>
            <li>Live more intentionally and meaningfully</li>
            <li>Appreciate the present moment</li>
          </ul>
          <Typography variant="body1">
            This feature is inspired by the ancient practice of memento mori - remembering that we must die.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 