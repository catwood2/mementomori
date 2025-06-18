import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, differenceInMonths, differenceInYears, addYears } from 'date-fns';

interface DeathDateProps {
  deathDate: Date;
  onDeathDateChange: (date: Date) => void;
}

const getTimeRemaining = (deathDate: Date): string => {
  const now = new Date();
  const years = differenceInYears(deathDate, now);
  const months = differenceInMonths(deathDate, now) % 12;
  const days = differenceInDays(deathDate, now) % 30;

  return `${years} years, ${months} months, and ${days} days remaining`;
};

const DeathDate: React.FC<DeathDateProps> = ({ deathDate, onDeathDateChange }) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(deathDate);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = () => {
    onDeathDateChange(tempDate);
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        p: isMobile ? 2 : 3,
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom 
            color="white"
            sx={{ mb: isMobile ? 1 : 2 }}
          >
            Your Death Date
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            color="white" 
            sx={{ 
              mb: isMobile ? 1 : 2,
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          >
            {deathDate.toLocaleDateString()}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Typography 
            variant="body1" 
            color="rgba(255, 255, 255, 0.7)"
            sx={{ mb: isMobile ? 2 : 3 }}
          >
            {getTimeRemaining(deathDate)}
          </Typography>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
              },
              transition: 'all 0.3s ease',
            }}
          >
            Change Date
          </Button>
        </motion.div>
      </Box>

      <AnimatePresence>
        {open && (
          <Dialog 
            open={open} 
            onClose={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Set Your Death Date
                </motion.div>
              </DialogTitle>
              <DialogContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <TextField
                    type="date"
                    value={tempDate.toISOString().split('T')[0]}
                    onChange={(e) => setTempDate(new Date(e.target.value))}
                    fullWidth
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          transition: 'border-color 0.3s ease',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                    }}
                  />
                </motion.div>
              </DialogContent>
              <DialogActions>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                      background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Save
                  </Button>
                </motion.div>
              </DialogActions>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeathDate; 