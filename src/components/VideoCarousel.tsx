import React, { useState } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme, Paper } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import featuredVideos from '../data/featuredVideos';

type FeaturedVideo = {
  id: string;
  title: string;
  url: string;
};

const featuredVideosTyped: FeaturedVideo[] = featuredVideos;

const VideoCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? featuredVideosTyped.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setIndex((prev) => (prev === featuredVideosTyped.length - 1 ? 0 : prev + 1));
  };

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
                key={featuredVideosTyped[index].id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${featuredVideosTyped[index].id}`}
                  title={featuredVideosTyped[index].title}
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
          {featuredVideosTyped[index].title}
        </Typography>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
        {featuredVideosTyped.map((video: FeaturedVideo, i: number) => (
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
    </Box>
  );
};

export default VideoCarousel; 