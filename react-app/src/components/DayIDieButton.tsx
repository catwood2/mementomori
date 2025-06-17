import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Info, Close, CalendarToday, Timer } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { addYears, differenceInYears, differenceInMonths, differenceInDays, isValid } from 'date-fns';

const MotionButton = motion(Button);

// Actuarial life expectancy table (simplified)
const LIFE_EXPECTANCY: { [key: number]: number } = {
  0: 79, 1: 78, 2: 77, 3: 76, 4: 75, 5: 74, 6: 73, 7: 72, 8: 71, 9: 70,
  10: 69, 11: 68, 12: 67, 13: 66, 14: 65, 15: 64, 16: 63, 17: 62, 18: 61, 19: 60,
  20: 59, 21: 58, 22: 57, 23: 56, 24: 55, 25: 54, 26: 53, 27: 52, 28: 51, 29: 50,
  30: 49, 31: 48, 32: 47, 33: 46, 34: 45, 35: 44, 36: 43, 37: 42, 38: 41, 39: 40,
  40: 39, 41: 38, 42: 37, 43: 36, 44: 35, 45: 34, 46: 33, 47: 32, 48: 31, 49: 30,
  50: 29, 51: 28, 52: 27, 53: 26, 54: 25, 55: 24, 56: 23, 57: 22, 58: 21, 59: 20,
  60: 19, 61: 18, 62: 17, 63: 16, 64: 15, 65: 14, 66: 13, 67: 12, 68: 11, 69: 10,
  70: 9, 71: 8, 72: 7, 73: 6, 74: 5, 75: 4, 76: 3, 77: 2, 78: 1, 79: 0
};

export default function DayIDieButton() {
  const [showInfo, setShowInfo] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deathDate, setDeathDate] = useState<Date | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    // Check if user has already calculated their death date
    const savedDeathDate = localStorage.getItem('deathDate');
    if (savedDeathDate) {
      const date = new Date(savedDeathDate);
      if (isValid(date) && date > new Date()) {
        setDeathDate(date);
        setHasCalculated(true);
      } else {
        localStorage.removeItem('deathDate');
      }
    }
  }, []);

  const handleClose = () => {
    setIsDismissed(true);
  };

  const calculateDeathDate = (birthDate: Date) => {
    if (!isValid(birthDate)) return null;
    
    const now = new Date();
    if (birthDate > now) return null; // Invalid future birth date
    
    const age = differenceInYears(now, birthDate);
    const lifeExpectancy = LIFE_EXPECTANCY[Math.min(age, 79)] || 0;
    const deathDate = addYears(birthDate, lifeExpectancy);
    
    // Ensure death date is in the future
    if (deathDate <= now) return null;
    
    localStorage.setItem('deathDate', deathDate.toISOString());
    return deathDate;
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      const calculatedDeathDate = calculateDeathDate(date);
      if (calculatedDeathDate) {
        setDeathDate(calculatedDeathDate);
        setHasCalculated(true);
      }
    }
    setShowDatePicker(false); // Always close the dialog after selection
  };

  const calculateTimeLeft = (deathDate: Date) => {
    const now = new Date();
    const years = differenceInYears(deathDate, now);
    const months = differenceInMonths(deathDate, now) % 12;
    const days = differenceInDays(deathDate, now) % 30;
    
    return { years, months, days };
  };

  if (isDismissed) {
    return null;
  }

  if (hasCalculated && deathDate) {
    const { years, months, days } = calculateTimeLeft(deathDate);
    return (
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        px: 2
      }}>
        <Timer sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary">
          Your time ends on {deathDate.toLocaleDateString()} ({years} years, {months} months, and {days} days remaining)
        </Typography>
        <Tooltip title="Dismiss">
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              ml: 'auto',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}>
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
          Calculate Your Death Date
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
            Enter Your Birth Date
          </Typography>
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Birth Date"
              onChange={handleDateSelect}
              maxDate={new Date()}
              sx={{ width: '100%', mt: 2 }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDatePicker(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showInfo}
        onClose={() => setShowInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Memento Mori
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            "Memento Mori" (Remember you must die) uses actuarial life expectancy tables to estimate your remaining time based on your birth date.
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