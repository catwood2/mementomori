import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const StoicAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractQuotes = (text: string): string[] => {
    // Match text between quotation marks
    const quoteRegex = /"([^"]+)"/g;
    const matches = text.match(quoteRegex);
    if (!matches) return [];
    
    // Remove the quotation marks and add source if found
    return [...new Set(matches.map(quote => {
      const quoteText = quote.slice(1, -1);
      const quoteIndex = text.indexOf(quote);
      const surroundingText = text.slice(Math.max(0, quoteIndex - 100), quoteIndex + quote.length + 100);
      
      // Look for "quote" - author pattern
      const dashMatch = surroundingText.match(/"([^"]+)"\s*-\s*(\w+)/i);
      if (dashMatch && dashMatch[1] === quoteText) {
        return `${quoteText} - ${dashMatch[2].trim()}`;
      }
      
      return quoteText;
    }))];
  };

  // Locked-in categories
  const categories = [
    'Virtue',
    'Control',
    'Perception',
    'Action',
    'Acceptance',
    'Resilience',
    'Death & Mortality',
    'Desire & Aversion',
    'Emotions',
    'Community & Relationships'
  ];

  // System prompt for category assignment
  const categoryPrompt = `Given the following quote, assign it to the most appropriate category from this list. Respond with only the exact category name as written, no extra words:\n- ${categories.join('\n- ')}`;

  function normalizeCategory(cat: string): string {
    return cat.trim()
      .replace(/&/g, 'and')
      .replace(/\band\b/gi, '&')
      .replace(/\s+/g, ' ')
      .replace(/[^\w& ]/g, '')
      .toLowerCase();
  }

  const getCategoryForQuote = async (quote: string): Promise<string> => {
    const response = await fetch('/.netlify/functions/stoic-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: quote, mode: 'category', systemPrompt: categoryPrompt }),
    });
    if (!response.ok) throw new Error('Failed to get category from Stoic Advisor');
    const data = await response.json();
    let category = (data.category || data.response || '').trim();
    // Try to match normalized category
    const normalized = normalizeCategory(category);
    const match = categories.find(c => normalizeCategory(c) === normalized);
    if (match) return match;
    // Fallback: try partial match
    const partial = categories.find(c => normalizeCategory(c).includes(normalized) || normalized.includes(normalizeCategory(c)));
    if (partial) return partial;
    // Fallback: Perception
    setSnackbar({ open: true, message: `Warning: Could not match category "${category}". Defaulted to Perception.`, severity: 'warning' });
    return 'Perception';
  };

  const addQuoteToAirtable = async (quote: string) => {
    try {
      // Get category from Stoic Advisor
      const category = await getCategoryForQuote(quote);
      const payload = {
        fields: {
          Quote: quote,
          Category: category,
          Likes: 0,
          Replies: 0,
          Retweets: 0
        }
      };
      console.log('Sending payload to Airtable:', payload);
      const response = await fetch('/.netlify/functions/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Airtable error response:', errorData);
        throw new Error('Failed to add quote to Airtable');
      }
      setSnackbar({
        open: true,
        message: `Quote added to collection (Category: ${category})`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding quote:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add quote to collection',
        severity: 'error'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/stoic-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      // Extract and add quotes to Airtable
      const quotes = extractQuotes(data.response);
      for (const quote of quotes) {
        await addQuoteToAirtable(quote);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I am unable to provide a response at this moment. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '800px',
        margin: '0 auto',
        p: isMobile ? 1 : 2,
        gap: isMobile ? 1 : 2,
        width: '100%'
      }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              flex: 1, 
              p: isMobile ? 2 : 3, 
              overflow: 'auto',
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 1 : 2
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
                Stoic Advisor
              </Typography>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: isMobile ? 2 : 3, 
                  textAlign: 'center', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  px: isMobile ? 1 : 2,
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                Share your challenge and receive wisdom from Stoic philosophy. How can we apply ancient principles to your modern situation?
              </Typography>
            </motion.div>

            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              mb: isMobile ? 1 : 2,
              px: isMobile ? 0.5 : 1
            }}>
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        mb: isMobile ? 1 : 2
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: isMobile ? 1.5 : 2,
                          maxWidth: isMobile ? '85%' : '60%',
                          backgroundColor: message.role === 'user' 
                            ? 'rgba(155, 44, 44, 0.1)' 
                            : 'rgba(184, 50, 128, 0.1)',
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          color="white"
                          sx={{ 
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            lineHeight: 1.5
                          }}
                        >
                          {message.content}
                        </Typography>
                      </Paper>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: isMobile ? 1 : 2 }}>
                    <CircularProgress 
                      size={isMobile ? 20 : 24} 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }} 
                    />
                  </Box>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Paper 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              p: isMobile ? 1 : 2, 
              display: 'flex', 
              gap: 1,
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'sticky',
              bottom: 0,
              zIndex: 1
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              minRows={1}
              variant="outlined"
              placeholder="Share your challenge..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              size={isMobile ? "small" : "medium"}
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
                '& .MuiInputBase-input': {
                  maxHeight: isMobile ? '120px' : '160px',
                  overflowY: 'auto',
                  transition: 'all 0.3s ease',
                },
              }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !input.trim()}
                sx={{
                  minWidth: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  background: "linear-gradient(45deg, #9B2C2C 30%, #B83280 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #B83280 30%, #9B2C2C 90%)",
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <SendIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              </Button>
            </motion.div>
          </Paper>
        </motion.div>

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
    </motion.div>
  );
};

export default StoicAdvisor; 