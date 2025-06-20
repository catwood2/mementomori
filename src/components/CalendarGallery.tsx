import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert } from '@mui/material';

// Types
interface CalendarImage {
  id: string;
  url: string;
  caption?: string;
  username?: string;
}

const StoicPhotos: React.FC = () => {
  const [images, setImages] = useState<CalendarImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState({ caption: '', username: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [uploading, setUploading] = useState(false);
  const [cloudinaryReady, setCloudinaryReady] = useState(false);

  // Dynamically load Cloudinary widget script
  useEffect(() => {
    if (!document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = () => {
        console.log('Cloudinary widget script loaded (dynamically)');
        setCloudinaryReady(true);
      };
      document.body.appendChild(script);
    } else {
      setCloudinaryReady(true);
    }
  }, []);

  // Fetch images from Airtable
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/airtable-calendar-gallery');
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Cloudinary upload widget
  const openCloudinaryWidget = () => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    console.log('Cloudinary cloudName:', cloudName);
    console.log('Cloudinary uploadPreset:', uploadPreset);
    if (!(window as any).cloudinary) {
      alert('Cloudinary widget failed to load. Please refresh the page or try again later.');
      console.error('Cloudinary widget script not loaded.');
      return;
    }
    try {
      (window as any).cloudinary.openUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local', 'url', 'camera'],
          cropping: false,
          multiple: false,
          folder: 'mementomori-calendars',
          maxFileSize: 10 * 1024 * 1024, // 10MB
          resourceType: 'image',
        },
        async (error: any, result: any) => {
          console.log('Cloudinary widget callback', { error, result });
          if (!error && result && result.event === 'success') {
            setUploading(true);
            try {
              // Send to Netlify function to save in Airtable
              const res = await fetch('/.netlify/functions/airtable-calendar-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  url: result.info.secure_url,
                  caption: form.caption,
                  username: form.username,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Failed to save image');
              setSnackbar({ open: true, message: 'Image uploaded!', severity: 'success' });
              setUploadOpen(false);
              setForm({ caption: '', username: '' });
              fetchImages();
            } catch (err: any) {
              setSnackbar({ open: true, message: err.message, severity: 'error' });
            } finally {
              setUploading(false);
            }
          } else if (error) {
            console.error('Cloudinary widget error:', error);
          }
        }
      );
    } catch (err) {
      console.error('Error opening Cloudinary widget:', err);
    }
  };

  // Minimal Cloudinary widget test
  const openMinimalCloudinaryWidget = () => {
    if (!(window as any).cloudinary) {
      alert('Cloudinary widget not loaded');
      return;
    }
    try {
      (window as any).cloudinary.openUploadWidget({
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
      }, (error: any, result: any) => {
        console.log('Minimal widget callback', { error, result });
        if (error) alert('Widget error: ' + error.message);
      });
    } catch (err) {
      alert('Exception: ' + err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 2 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3, color: '#9B2C2C', fontWeight: 700 }}>
        Stoic Photos Gallery
      </Typography>
      <Typography align="center" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
        See how others are living stoically. Upload your own calendar, quote wall, or any photo that inspires your practice!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setUploadOpen(true)}>
          Upload Your Photo
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Button variant="outlined" color="secondary" onClick={openMinimalCloudinaryWidget}>
          TEST: Minimal Cloudinary Widget
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
              <Paper elevation={3} sx={{ p: 1, bgcolor: 'rgba(30,30,30,0.95)', borderRadius: 2 }}>
                <Box sx={{ width: '100%', aspectRatio: '1/1', mb: 1, overflow: 'hidden', borderRadius: 2 }}>
                  <img src={img.url} alt={img.caption || 'Calendar'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, background: '#000' }} />
                </Box>
                {img.caption && (
                  <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                    {img.caption}
                  </Typography>
                )}
                {img.username && (
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    by {img.username}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <DialogTitle>Upload Your Calendar</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
          <TextField
            label="Caption (optional)"
            value={form.caption}
            onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Your Name (optional)"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={openCloudinaryWidget}
            disabled={uploading || !cloudinaryReady}
            sx={{ mt: 2 }}
          >
            {uploading ? <CircularProgress size={20} /> : 'Select Image & Upload'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
        </DialogActions>
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

export default StoicPhotos; 