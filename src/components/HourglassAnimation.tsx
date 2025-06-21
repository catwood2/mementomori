import React from 'react';
import { motion } from 'framer-motion';
import { HourglassEmpty } from '@mui/icons-material';
import { Box } from '@mui/material';

const HourglassAnimation = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
    <motion.div
      animate={{ rotate: [0, 180, 180, 360, 360] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.6, 0.9, 1]
       }}
    >
      <HourglassEmpty sx={{ fontSize: 36, color: '#FFD700' }} />
    </motion.div>
  </Box>
);

export default HourglassAnimation; 