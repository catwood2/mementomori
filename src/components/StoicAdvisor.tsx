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
  IconButton,
  Tooltip
} from '@mui/material';
import { Send as SendIcon, ContentCopy, DeleteOutline } from '@mui/icons-material';
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

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('stoicAdvisorHistory');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stoicAdvisorHistory', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    // Fallback: Life
    return 'Life';
  };

  // Add this helper to get attribution from AI
  const getAttributionForQuote = async (quote: string): Promise<string> => {
    const response = await fetch('/.netlify/functions/stoic-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: quote, mode: 'attribution' }),
    });
    if (!response.ok) throw new Error('Failed to get attribution from Stoic Advisor');
    const data = await response.json();
    return (data.attribution || data.response || 'Unknown').trim();
  };

  const addQuoteToAirtable = async (quote: string) => {
    try {
      // Get category from Stoic Advisor
      const category = await getCategoryForQuote(quote);
      // Get attribution from Stoic Advisor
      const attribution = await getAttributionForQuote(quote);
      const payload = {
        fields: {
          Quote: quote,
          Attribution: attribution,
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
        message: `Quote added to collection (Category: ${category}, Attribution: ${attribution})`,
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

  // Clear chat history
  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('stoicAdvisorHistory');
    setSnackbar({ open: true, message: 'Chat history cleared.', severity: 'success' });
  };

  // Copy chat history
  const handleCopyHistory = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'Stoic Advisor'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Chat history copied!', severity: 'success' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          mx: 'auto',
          mt: { xs: 1, sm: 4 },
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'rgba(42, 42, 42, 0.6)', // Glassy dark grey
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', // Safari support
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          px: { xs: 1, sm: 0 },
        }}
      >
        {/* Chat Header with actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(30,30,30,0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ color: '#9B2C2C', fontWeight: 700 }}>
            Stoic Advisor
          </Typography>
          <Box>
            <Tooltip title="Copy chat history">
              <IconButton size="small" onClick={handleCopyHistory}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear chat history">
              <IconButton size="small" onClick={handleClearHistory}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Chat Body */}
        <Box sx={{ p: 2, minHeight: 320, maxHeight: isMobile ? 350 : 400, overflowY: 'auto', backgroundColor: '#fff' }}>
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <Box sx={{ mb: 2, display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      bgcolor: msg.role === 'user' ? '#0B93F6' : '#E9E9EB',
                      color: msg.role === 'user' ? '#fff' : '#000',
                      borderRadius: 2,
                      maxWidth: '80%',
                      ml: msg.role === 'user' ? 2 : 0,
                      mr: msg.role === 'assistant' ? 2 : 0,
                      fontSize: isMobile ? '1rem' : '1.05rem',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.content}
                  </Paper>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Typing indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2, ml: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  bgcolor: '#E9E9EB',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <motion.span
                  style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#B0B0B0', marginRight: 4 }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span
                  style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#B0B0B0', marginRight: 4 }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                />
                <motion.span
                  style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#B0B0B0' }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        {/* Chat Input */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', p: 1.5, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask the Stoic Advisor…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            sx={{
              mr: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: '#fff',
                color: '#222', // Ensure input text is dark
                '& input': {
                  color: '#222',
                },
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
                '&:hover fieldset': {
                  borderColor: '#BDBDBD',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0B93F6',
                },
              },
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e as any);
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!input.trim() || isLoading}
            sx={{
              minWidth: 40,
              minHeight: 40,
              p: 0,
              borderRadius: '50%',
              backgroundColor: '#0B93F6',
              '&:hover': {
                backgroundColor: '#0072C7'
              }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
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
      </Paper>
    </motion.div>
  );
};

export default StoicAdvisor; 