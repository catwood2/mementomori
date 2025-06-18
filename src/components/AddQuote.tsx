import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Add as AddIcon } from '@mui/icons-material';

interface AddQuoteProps {
  onAddQuote: (quote: string) => void;
}

const AddQuote: React.FC<AddQuoteProps> = ({ onAddQuote }) => {
  const [quote, setQuote] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quote.trim()) {
      onAddQuote(quote.trim());
      setQuote('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        maxWidth: '600px',
        margin: '0 auto',
        p: isMobile ? 2 : 3
      }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: isMobile ? 2 : 3,
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              gutterBottom 
              align="center" 
              color="white"
              sx={{ mb: isMobile ? 1 : 2 }}
            >
              Add a Quote
            </Typography>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TextField
              multiline
              rows={3}
              variant="outlined"
              placeholder="Enter your quote..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              fullWidth
              sx={{
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

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ alignSelf: 'center' }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={!quote.trim()}
                startIcon={<AddIcon />}
                sx={{
                  minWidth: '120px',
                  background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  px: 3,
                  py: 1
                }}
              >
                Add Quote
              </Button>
            </motion.div>
          </motion.div>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default AddQuote; 