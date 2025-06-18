import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const StoicAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to your ChatGPT endpoint
      const response = await fetch('/api/stoic-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Fallback response for development
      const fallbackMessage: Message = {
        role: 'assistant',
        content: "As Marcus Aurelius would say, 'The impediment to action advances action. What stands in the way becomes the way.' What specific challenge are you facing?",
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h5" gutterBottom align="center" color="white">
          Stoic Advisor
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
          Ask for stoic wisdom or advice on any challenge you're facing
        </Typography>

        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, p: 2 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.role === 'user' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(244, 143, 177, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" color="white">
                  {message.content}
                </Typography>
              </Paper>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            gap: 1,
            p: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask for stoic wisdom..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
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
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !input.trim()}
            sx={{
              minWidth: 48,
              height: 48,
              background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
              },
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StoicAdvisor; 