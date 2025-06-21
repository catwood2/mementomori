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
  const birthDate = new Date('1990-01-01'); // Default birth date - could be made configurable
  const deathDateObj = new Date(deathDate);
  const totalWeeks = Math.ceil((deathDateObj.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksLived = Math.ceil((currentTime.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksRemaining = totalWeeks - weeksLived;

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
        gap: 0.5,
        maxWidth: '100%',
        overflow: 'auto'
      }}>
        {Array.from({ length: totalWeeks }, (_, index) => {
          const isPast = index < weeksLived;
          const isCurrent = index === weeksLived;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isPast ? 1 : 0.3,
                scale: isCurrent ? 1.2 : 1,
                backgroundColor: isPast ? '#9B2C2C' : isCurrent ? '#FFD700' : 'rgba(255,255,255,0.1)'
              }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.001 // Stagger the animation
              }}
              style={{
                width: isMobile ? 6 : 8,
                height: isMobile ? 6 : 8,
                borderRadius: '50%',
                border: isCurrent ? '1px solid #FFD700' : 'none',
              }}
            />
          );
        })}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {weeksLived.toLocaleString()} weeks lived
        </Typography>
        <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
          {weeksRemaining.toLocaleString()} weeks remaining
        </Typography>
      </Box>
    </Paper>
  );
};

export default LifeCalendar; 