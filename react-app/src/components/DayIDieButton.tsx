import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip,
} from '@mui/material';
import { Info, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

export default function DayIDieButton() {
  const [showInfo, setShowInfo] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleClose = () => {
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MotionButton
          variant="contained"
          color="primary"
          size="large"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            borderRadius: '50px',
            px: 3,
            py: 1.5,
            boxShadow: 3,
          }}
        >
          Day I Die
        </MotionButton>
        
        <Tooltip title="Learn more">
          <IconButton
            onClick={() => setShowInfo(true)}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Info />
          </IconButton>
        </Tooltip>

        <Tooltip title="Dismiss">
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={showInfo}
        onClose={() => setShowInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Day I Die
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            "Day I Die" is a unique feature that helps you reflect on your mortality and make the most of your time.
          </Typography>
          <Typography variant="body1" paragraph>
            By acknowledging our limited time, we can:
          </Typography>
          <ul>
            <li>Focus on what truly matters</li>
            <li>Make better decisions about how we spend our time</li>
            <li>Live more intentionally and meaningfully</li>
            <li>Appreciate the present moment</li>
          </ul>
          <Typography variant="body1">
            This feature is inspired by the ancient practice of memento mori - remembering that we must die.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 