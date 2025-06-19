import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme, Paper, CircularProgress, Button, TextField, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

type FeaturedVideo = {
  id: string;
  title: string;
  description?: string;
};

const VideoCarousel: React.FC = () => {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ youtubeUrl: '', title: '', description: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/airtable-videos');
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/.netlify/functions/airtable-add-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add video');
      setSnackbar({ open: true, message: 'Video added!', severity: 'success' });
      setAddOpen(false);
      setForm({ youtubeUrl: '', title: '', description: '' });
      fetchVideos();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}><CircularProgress /></Box>;
  }
  if (!videos.length) {
    return <Typography align="center" color="text.secondary">No videos available.</Typography>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: isMobile ? 1 : 3 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 1 : 2, bgcolor: 'rgba(30,30,30,0.95)', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 0, zIndex: 2 }} aria-label="Previous video">
            <ArrowBackIos />
          </IconButton>
          <Box sx={{ width: isMobile ? 280 : 480, height: isMobile ? 158 : 270, mx: 'auto', overflow: 'hidden', borderRadius: 2 }}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={videos[index].id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videos[index].id}`}
                  title={videos[index].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 8, background: '#000' }}
                />
              </motion.div>
            </AnimatePresence>
          </Box>
          <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 0, zIndex: 2 }} aria-label="Next video">
            <ArrowForwardIos />
          </IconButton>
        </Box>
        <Typography variant={isMobile ? 'body1' : 'h6'} align="center" sx={{ mt: 2, color: 'white' }}>
          {videos[index].title}
        </Typography>
        {videos[index].description && (
          <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
            {videos[index].description}
          </Typography>
        )}
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
        {videos.map((video, i) => (
          <Box
            key={video.id}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i === index ? '#9B2C2C' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" color="primary" onClick={() => setAddOpen(true)}>
          Add a Video
        </Button>
      </Box>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add a YouTube Video</DialogTitle>
        <form onSubmit={handleAddVideo}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
            <TextField
              label="YouTube URL"
              value={form.youtubeUrl}
              onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Title (optional)"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Description (optional)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
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
};

export default VideoCarousel; 