import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Info, Close, CalendarToday, Timer } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { addYears, differenceInYears, differenceInMonths, differenceInDays, isValid } from 'date-fns';

const MotionButton = motion(Button);

// SSA Actuarial Table data (simplified)
const LIFE_EXPECTANCY = {
  male: {
    0: 76.1, 20: 57.6, 30: 48.2, 40: 38.9, 50: 29.9, 60: 21.7, 70: 14.6, 80: 8.9, 90: 4.8
  },
  female: {
    0: 81.1, 20: 61.8, 30: 52.2, 40: 42.7, 50: 33.3, 60: 24.5, 70: 16.8, 80: 10.4, 90: 5.6
  }
};

export default function DayIDieButton() {
  const [showInfo, setShowInfo] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('male');
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

  const calculateDeathDate = (birthDate: string, gender: string) => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    if (!isValid(birth) || birth > today) return null;
    
    // Calculate exact age in years
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Find the closest age in the table
    const ages = Object.keys(LIFE_EXPECTANCY[gender as keyof typeof LIFE_EXPECTANCY])
      .map(Number)
      .sort((a, b) => a - b);
    
    const closestAge = ages.reduce((prev, curr) => {
      return Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev;
    });

    // Get life expectancy
    const lifeExpectancy = LIFE_EXPECTANCY[gender as keyof typeof LIFE_EXPECTANCY][closestAge];

    // Calculate death date by adding remaining years to current date
    const deathDate = new Date(today);
    deathDate.setFullYear(deathDate.getFullYear() + Math.floor(lifeExpectancy));
    // Add the fractional part of the years as days
    const fractionalYears = lifeExpectancy - Math.floor(lifeExpectancy);
    const additionalDays = Math.floor(fractionalYears * 365.25); // Using 365.25 to account for leap years
    deathDate.setDate(deathDate.getDate() + additionalDays);
    
    return deathDate;
  };

  const handleCalculate = () => {
    const calculatedDeathDate = calculateDeathDate(birthDate, gender);
    if (calculatedDeathDate) {
      setDeathDate(calculatedDeathDate);
      setHasCalculated(true);
      localStorage.setItem('deathDate', calculatedDeathDate.toISOString());
      setShowDatePicker(false);
    }
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
          My number is up: {deathDate.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} ({years} years, {months} months, and {days} days remaining)
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          startIcon={<CalendarToday />}
          sx={{
            borderRadius: '12px',
            px: 2.5,
            py: 1,
            boxShadow: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
              boxShadow: 3,
            },
          }}
        >
          Calculate Your Death Date
        </MotionButton>
        
        <Tooltip title="Learn more">
          <IconButton
            onClick={() => setShowInfo(true)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: 2,
              },
            }}
          >
            <Info />
          </IconButton>
        </Tooltip>

        <Tooltip title="Dismiss">
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: 2,
              },
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
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" color="white">
            Enter Your Birth Date
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="date"
              label="Birth Date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0],
                sx: { color: 'white' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              }}
            />
            <TextField
              select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDatePicker(false)}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCalculate}
            variant="contained"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            Calculate
          </Button>
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