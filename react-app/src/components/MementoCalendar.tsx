import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { differenceInWeeks, startOfWeek } from 'date-fns';

interface DotProps {
  isCleared: boolean;
  isCurrent: boolean;
  delay: number;
}

const Dot: React.FC<DotProps> = ({ isCleared, isCurrent, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isCleared ? 0 : 1,
        scale: isCurrent ? [1, 1.2, 1] : 1
      }}
      transition={{ 
        duration: 0.5,
        delay: delay * 0.01,
        repeat: isCurrent ? Infinity : 0,
        repeatType: "reverse"
      }}
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: isCurrent ? '#ff4444' : '#333',
        margin: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isCurrent && (
        <motion.div
          initial={{ x: -8 }}
          animate={{ x: 8 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#ff4444',
            borderRadius: '50%'
          }}
        />
      )}
    </motion.div>
  );
};

interface MementoCalendarProps {
  birthDate: Date;
}

export default function MementoCalendar({ birthDate }: MementoCalendarProps) {
  const [weeks, setWeeks] = useState<boolean[][]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);

  useEffect(() => {
    const calculateWeeks = () => {
      const now = new Date();
      const weeksLived = differenceInWeeks(now, birthDate);
      const currentWeekIndex = differenceInWeeks(startOfWeek(now), startOfWeek(birthDate));

      const rows: boolean[][] = [];
      for (let i = 0; i < 40; i++) {
        const row: boolean[] = [];
        for (let j = 0; j < 104; j++) {
          const weekIndex = i * 104 + j;
          row.push(weekIndex < weeksLived);
        }
        rows.push(row);
      }

      setWeeks(rows);
      setCurrentWeek(currentWeekIndex);
    };

    calculateWeeks();
    // Update every week
    const interval = setInterval(calculateWeeks, 7 * 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        maxWidth: '100%',
        overflow: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        Your Life in Weeks
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {weeks.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              gap: 0.5,
              justifyContent: 'center'
            }}
          >
            {row.map((isCleared, colIndex) => {
              const weekIndex = rowIndex * 104 + colIndex;
              return (
                <Dot
                  key={colIndex}
                  isCleared={isCleared}
                  isCurrent={weekIndex === currentWeek}
                  delay={weekIndex}
                />
              );
            })}
          </Box>
        ))}
      </Box>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        Each dot represents one week of your 80-year life
      </Typography>
    </Paper>
  );
} 