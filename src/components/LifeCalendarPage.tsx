import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DayIDieButton from './DayIDieButton';
import LifeCalendar from './LifeCalendar';

interface LifeCalendarPageProps {
  onNavigateHome: () => void;
}

const LifeCalendarPage: React.FC<LifeCalendarPageProps> = ({ onNavigateHome }) => {
  const [deathDate, setDeathDate] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(true);

  useEffect(() => {
    // Check local storage on initial render
    const savedDeathDate = localStorage.getItem('deathDate');
    if (savedDeathDate) {
      setDeathDate(savedDeathDate);
      setDialogOpen(false); // Don't show dialog if date is already set
    }
  }, []);

  const handleDateSet = (date: string) => {
    setDeathDate(date);
    setDialogOpen(false); // Close dialog on success
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // If user closes dialog, and there's no date, navigate home
    if (!localStorage.getItem('deathDate')) {
      onNavigateHome();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#9B2C2C', fontWeight: 700, mb: 4 }}>
        Contemplate Your Time
      </Typography>

      {deathDate ? (
        <>
          <Typography align="center" sx={{ mb: 1, color: 'text.secondary', fontStyle: 'italic' }}>
            Your calculated day of death is {deathDate}.
          </Typography>
          <Typography align="center" sx={{ mb: 3, color: 'text.secondary', fontStyle: 'italic' }}>
            Below is your Memento Mori calendar based on an 80-year lifespan.
          </Typography>
          <LifeCalendar deathDate={deathDate} />
        </>
      ) : (
        <DayIDieButton 
          isOpen={isDialogOpen}
          onDeathDateSet={handleDateSet} 
          onClose={handleCloseDialog} 
        />
      )}
    </Box>
  );
};

export default LifeCalendarPage; 