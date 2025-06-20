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

  // DEBUG: Log Vite env variables explicitly
  console.log('DEBUG VITE_CLOUDINARY_CLOUD_NAME:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  console.log('DEBUG VITE_CLOUDINARY_UPLOAD_PRESET:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  // Dual-mode env variable support for Vite and Node/CRA
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    (typeof process !== 'undefined' && process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    (typeof process !== 'undefined' && process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  const cloudinaryConfigMissing = !cloudName || !uploadPreset;

  console.log('Cloudinary env:', { cloudName, uploadPreset, cloudinaryConfigMissing });

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
    if (cloudinaryConfigMissing) {
      alert('Cloudinary configuration missing. Please contact the site administrator.');
      return;
    }
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
    if (cloudinaryConfigMissing) {
      alert('Cloudinary configuration missing. Please contact the site administrator.');
      return;
    }
    if (!(window as any).cloudinary) {
      alert('Cloudinary widget not loaded');
      return;
    }
    try {
      (window as any).cloudinary.openUploadWidget({
        cloudName,
        uploadPreset,
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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : images.length === 0 ? (
        <Typography align="center" sx={{ color: 'rgba(255,255,255,0.7)', mt: 4 }}>
          No photos have been shared yet. Be the first to upload!
        </Typography>
      ) : (
        <PhotoCarousel images={images} />
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
            disabled={uploading || !cloudinaryReady || cloudinaryConfigMissing}
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

// Simple photo carousel component
import { useState as useCarouselState } from 'react';
interface PhotoCarouselProps {
  images: CalendarImage[];
}
const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ images }) => {
  const [index, setIndex] = useCarouselState(0);
  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  const img = images[index];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Box sx={{ position: 'relative', width: { xs: '90vw', sm: 400, md: 500 }, height: { xs: 320, sm: 400, md: 500 }, mb: 2 }}>
        <img
          src={img.url}
          alt={img.caption || 'Stoic Photo'}
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 16, background: '#000' }}
        />
        {images.length > 1 && (
          <>
            <Button onClick={prev} sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', minWidth: 0, bgcolor: 'rgba(30,30,30,0.7)', color: 'white', borderRadius: '50%' }}>
              &#8592;
            </Button>
            <Button onClick={next} sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', minWidth: 0, bgcolor: 'rgba(30,30,30,0.7)', color: 'white', borderRadius: '50%' }}>
              &#8594;
            </Button>
          </>
        )}
      </Box>
      {img.caption && (
        <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>{img.caption}</Typography>
      )}
      {img.username && (
        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>by {img.username}</Typography>
      )}
      {images.length > 1 && (
        <Box sx={{ mt: 1 }}>
          {images.map((_, i) => (
            <Box key={i} sx={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', bgcolor: i === index ? '#9B2C2C' : 'rgba(255,255,255,0.3)', mx: 0.5 }} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default StoicPhotos; 