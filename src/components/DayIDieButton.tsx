import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, CalendarToday } from "@mui/icons-material";
import { motion } from "framer-motion";
import { format, differenceInDays, addYears } from "date-fns";

const MotionButton = motion(Button);

// Life expectancy data from SSA actuarial tables
const LIFE_EXPECTANCY = {
  male: 76.1, // years
  female: 81.1, // years
};

interface DayIDieButtonProps {
  isCalendarTab: boolean;
}

const DayIDieButton: React.FC<DayIDieButtonProps> = ({ isCalendarTab }) => {
  const [open, setOpen] = useState(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [deathDate, setDeathDate] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showResult, setShowResult] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const savedDeathDate = localStorage.getItem("deathDate");
    const hasCalculatedBefore = localStorage.getItem("hasCalculated");
    if (savedDeathDate) {
      setDeathDate(savedDeathDate);
      setShowResult(true);
    }
    if (hasCalculatedBefore) {
      setHasCalculated(true);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const calculateDeathDate = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const expectancy = LIFE_EXPECTANCY[gender];
    const death = addYears(birth, expectancy);
    const formattedDeathDate = format(death, "MMMM d, yyyy");
    
    setDeathDate(formattedDeathDate);
    localStorage.setItem("deathDate", formattedDeathDate);
    localStorage.setItem("hasCalculated", "true");
    setHasCalculated(true);
    setShowResult(true);
    handleClose();
  };

  const remainingDays = deathDate
    ? differenceInDays(new Date(deathDate), new Date())
    : 0;

  if (!isCalendarTab) return null;

  return (
    <>
      {!hasCalculated && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: 20,
            maxWidth: 300,
            bgcolor: "rgba(30, 30, 30, 0.95)",
            p: 2,
            borderRadius: 2,
            color: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="body2" gutterBottom>
            Click the button below to calculate your life expectancy and see your life calendar.
            Each dot represents one week of your 80-year life.
          </Typography>
        </Box>
      )}

      <MotionButton
        variant="contained"
        color="primary"
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 60,
          height: 60,
          minWidth: 60,
          padding: 0,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
          },
        }}
      >
        <CalendarToday />
      </MotionButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            color: 'white',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Calculate Your Time</Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value as "male" | "female")}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Birth Date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={calculateDeathDate}
              disabled={!birthDate}
              sx={{
                background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                },
              }}
            >
              Calculate
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {showResult && deathDate && (
        <Dialog
          open={showResult}
          onClose={() => setShowResult(false)}
          PaperProps={{
            sx: {
              background: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              maxWidth: 400,
              color: 'white',
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Your Time</Typography>
              <IconButton onClick={() => setShowResult(false)} size="small">
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Based on current life expectancy data, you are expected to die on:
            </Typography>
            <Typography
              variant="h4"
              align="center"
              sx={{ my: 2, color: "#FF6B6B" }}
            >
              {deathDate}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              That's approximately {remainingDays.toLocaleString()} days remaining.
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DayIDieButton;
