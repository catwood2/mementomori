import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const RipplesAnimation = () => {
  const rippleVariants = {
    start: {
      scale: 0,
      opacity: 1,
    },
    end: {
      scale: 4,
      opacity: 0,
    },
  };

  const rippleTransition = (delay: number) => ({
    duration: 2.5,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatDelay: 1,
    delay,
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4, height: 60 }}>
      <Box sx={{ position: 'relative', width: 20, height: 20 }}>
        {[0, 0.5, 1, 1.5].map((delay) => (
          <motion.div
            key={delay}
            variants={rippleVariants}
            initial="start"
            animate="end"
            transition={rippleTransition(delay)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid #FFD700',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RipplesAnimation; 