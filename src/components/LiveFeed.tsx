import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Favorite, FavoriteBorder, Share, ChatBubbleOutline } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  id: string;
  fields: {
    Quote: string;
    Category: string;
    SourceLink?: string;
    Likes: number;
    Replies: number;
    Retweets: number;
  };
}

const MotionCard = motion(Card);

export default function LiveFeed() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedQuotes, setLikedQuotes] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadQuotes();
    loadLikedQuotes();
    // Set up polling for new quotes every 30 seconds
    const interval = setInterval(loadQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQuotes = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/airtable');
      if (!response.ok) {
        throw new Error('Failed to load quotes');
      }
      const data = await response.json();
      setQuotes(data.records || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError(error instanceof Error ? error.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const loadLikedQuotes = () => {
    const stored = localStorage.getItem('likedQuotes');
    if (stored) {
      setLikedQuotes(JSON.parse(stored));
    }
  };

  const handleLike = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const isLiked = likedQuotes[quoteId];
    const newLikes = (quote.fields.Likes || 0) + (isLiked ? -1 : 1);

    try {
      const response = await fetch('/.netlify/functions/airtable', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: quoteId, likes: newLikes }),
      });

      if (!response.ok) throw new Error('Failed to update likes');

      const newLikedQuotes = { ...likedQuotes };
      if (isLiked) {
        delete newLikedQuotes[quoteId];
      } else {
        newLikedQuotes[quoteId] = true;
      }
      localStorage.setItem('likedQuotes', JSON.stringify(newLikedQuotes));
      setLikedQuotes(newLikedQuotes);

      setQuotes(quotes.map(q => 
        q.id === quoteId 
          ? { ...q, fields: { ...q.fields, Likes: newLikes } }
          : q
      ));

      setSnackbar({
        open: true,
        message: isLiked ? 'Quote unliked' : 'Quote liked',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating likes:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update likes',
        severity: 'error'
      });
    }
  };

  const handleShare = async (quote: Quote) => {
    try {
      await navigator.clipboard.writeText(quote.fields.Quote);
      setSnackbar({
        open: true,
        message: 'Quote copied to clipboard!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to copy quote',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 2 }}>
      <AnimatePresence>
        {quotes.map((quote, index) => (
          <MotionCard
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: (theme) => theme.palette.primary.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {quote.fields.Category[0]}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" component="div">
                    {quote.fields.Category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontStyle: 'italic',
                  position: 'relative',
                  pl: 2,
                }}
              >
                {quote.fields.Quote}
              </Typography>

              {quote.fields.SourceLink && (
                <Typography
                  variant="body2"
                  component="a"
                  href={quote.fields.SourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    display: 'block',
                    mb: 2,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Source
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={() => handleLike(quote.id)}
                    color="primary"
                    size="small"
                  >
                    {likedQuotes[quote.id] ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </motion.div>
                <Typography variant="body2" color="text.secondary">
                  {quote.fields.Likes || 0}
                </Typography>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={() => handleShare(quote)}
                    color="primary"
                    size="small"
                  >
                    <Share />
                  </IconButton>
                </motion.div>
                <Typography variant="body2" color="text.secondary">
                  {quote.fields.Retweets || 0}
                </Typography>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    color="primary"
                    size="small"
                  >
                    <ChatBubbleOutline />
                  </IconButton>
                </motion.div>
                <Typography variant="body2" color="text.secondary">
                  {quote.fields.Replies || 0}
                </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        ))}
      </AnimatePresence>

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
    </Box>
  );
} 