import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

interface LifeCalendarProps {
  deathDate: string | null;
}

const LifeCalendar: React.FC<LifeCalendarProps> = ({ deathDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!deathDate) {
    // Show animated hourglass when no death date is set
    return (
      <Paper
        elevation={3}
        sx={{
          bgcolor: 'rgba(30,30,30,0.9)',
          borderRadius: 3,
          p: isMobile ? 2 : 3,
          mb: 4,
          maxWidth: 400,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#9B2C2C', mb: 2, fontWeight: 600 }}>
          Time Flows
        </Typography>
        <Box sx={{ position: 'relative', height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: 60,
              height: 60,
              border: '2px solid #FFD700',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 8,
                height: 8,
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
          Set your date to see your life calendar
        </Typography>
      </Paper>
    );
  }

  // Calculate life calendar when death date is set
  const getBirthDate = () => {
    const savedBirthDate = localStorage.getItem('birthDate');
    if (savedBirthDate) {
      return new Date(savedBirthDate);
    }
    
    // If no birth date is saved, estimate based on death date and average lifespan
    const deathDateObj = new Date(deathDate);
    const averageLifespan = 80; // years
    const estimatedBirthDate = new Date(deathDateObj);
    estimatedBirthDate.setFullYear(estimatedBirthDate.getFullYear() - averageLifespan);
    
    return estimatedBirthDate;
  };

  const birthDate = getBirthDate();
  const deathDateObj = new Date(deathDate);
  const totalWeeks = Math.ceil((deathDateObj.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksLived = Math.max(0, Math.ceil((currentTime.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived);

  // Create grid of dots (52 weeks per row for a year)
  const weeksPerRow = 52;
  const rows = Math.ceil(totalWeeks / weeksPerRow);

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: 'rgba(30,30,30,0.9)',
        borderRadius: 3,
        p: isMobile ? 2 : 3,
        mb: 4,
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ color: '#9B2C2C', mb: 2, fontWeight: 600, textAlign: 'center' }}>
        Your Life Calendar
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, textAlign: 'center' }}>
        Each dot represents one week of your life
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${weeksPerRow}, 1fr)`,
        gap: 0.3,
        maxWidth: '100%',
        overflow: 'auto',
        p: 1,
        bgcolor: 'rgba(0,0,0,0.2)',
        borderRadius: 2
      }}>
        {Array.from({ length: totalWeeks }, (_, index) => {
          const isPast = index < weeksLived;
          const isCurrent = index === weeksLived;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1,
                scale: isCurrent ? 1.3 : 1,
              }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.0005
              }}
              style={{
                width: isMobile ? 5 : 7,
                height: isMobile ? 5 : 7,
                borderRadius: '50%',
                backgroundColor: isPast ? 'white' : isCurrent ? '#FFD700' : 'rgba(255,255,255,0.05)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isCurrent ? '1px solid #FFD700' : 'none',
                boxShadow: isCurrent ? '0 0 8px rgba(255, 215, 0, 0.6)' : 'none',
              }}
            >
              {isPast && (
                <Typography variant="caption" sx={{ color: '#444', lineHeight: 1, userSelect: 'none' }}>
                  x
                </Typography>
              )}
            </motion.div>
          );
        })}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {weeksLived.toLocaleString()} weeks lived
        </Typography>
        <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
          {weeksRemaining.toLocaleString()} weeks remaining
        </Typography>
      </Box>
      
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', textAlign: 'center', mt: 1 }}>
        {Math.floor(weeksLived / 52)} years, {weeksLived % 52} weeks • {Math.floor(weeksRemaining / 52)} years, {weeksRemaining % 52} weeks left
      </Typography>
    </Paper>
  );
};

export default LifeCalendar; 