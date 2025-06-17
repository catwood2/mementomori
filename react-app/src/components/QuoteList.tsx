import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Container,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface Quote {
  id: string;
  fields: {
    Quote: string;
    Category: string;
    SourceLink?: string;
    Likes: number;
  };
}

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

export default function QuoteList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [likedQuotes, setLikedQuotes] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadQuotes();
    loadLikedQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching quotes from:', '/.netlify/functions/airtable');
      const response = await fetch('/.netlify/functions/airtable');
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.details || 'Failed to load quotes');
      }
      const data = await response.json();
      console.log('Received data:', data);
      setQuotes(data.records || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setError(error instanceof Error ? error.message : 'Failed to load quotes. Please try again later.');
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

  const saveLikedQuotes = (newLikedQuotes: Record<string, boolean>) => {
    localStorage.setItem('likedQuotes', JSON.stringify(newLikedQuotes));
    setLikedQuotes(newLikedQuotes);
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

      // Update local state
      const newLikedQuotes = { ...likedQuotes };
      if (isLiked) {
        delete newLikedQuotes[quoteId];
      } else {
        newLikedQuotes[quoteId] = true;
      }
      saveLikedQuotes(newLikedQuotes);

      // Update quotes
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

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = !searchTerm || 
      quote.fields.Quote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || 
      quote.fields.Category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Life', 'Death', 'Humor', 'Motivation'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant={!filterCategory ? 'contained' : 'outlined'}
            onClick={() => setFilterCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'contained' : 'outlined'}
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      {filteredQuotes.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          No quotes found matching your criteria.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredQuotes.map((quote) => (
            <Box key={quote.id}>
              <Fade in timeout={500}>
                <StyledCard>
                  <CardContent>
                    <CategoryChip label={quote.fields.Category} />
                    <Typography
                      variant="body1"
                      component="p"
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
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Source
                      </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => handleLike(quote.id)}
                        color="primary"
                        size="small"
                      >
                        {likedQuotes[quote.id] ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {quote.fields.Likes || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Fade>
            </Box>
          ))}
        </Box>
      )}

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
    </Container>
  );
} 