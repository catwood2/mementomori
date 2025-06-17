import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const MotionCard = motion(Card);
const MotionButton = motion(Button);

interface QuoteFormProps {
  onQuoteAdded: () => void;
}

const categories = ['Life', 'Death', 'Humor', 'Motivation'];

export default function QuoteForm({ onQuoteAdded }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    quote: '',
    category: '',
    sourceLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/airtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            Quote: formData.quote,
            Category: formData.category,
            SourceLink: formData.sourceLink,
            Likes: 0,
            Replies: 0,
            Retweets: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add quote');
      }

      setFormData({ quote: '', category: '', sourceLink: '' });
      setSnackbar({
        open: true,
        message: 'Quote added successfully!',
        severity: 'success',
      });
      onQuoteAdded();
    } catch (error) {
      console.error('Error adding quote:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add quote. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Add a New Quote
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="quote"
            label="Quote"
            value={formData.quote}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            placeholder="Enter your quote here..."
          />
          <TextField
            fullWidth
            select
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            name="sourceLink"
            label="Source Link (optional)"
            value={formData.sourceLink}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://..."
          />
          <MotionButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{ width: '100%' }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Quote'
            )}
          </MotionButton>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MotionCard>
  );
} 