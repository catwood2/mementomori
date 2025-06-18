import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, CalendarToday } from "@mui/icons-material";
import { motion } from "framer-motion";
import { format, differenceInDays, addYears } from "date-fns";
import MementoCalendar from "./MementoCalendar";

const MotionButton = motion(Button);

// Life expectancy data from SSA actuarial tables
const LIFE_EXPECTANCY = {
  male: 76.1, // years
  female: 81.1, // years
};

const DayIDieButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [deathDate, setDeathDate] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activeTab, setActiveTab] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const savedDeathDate = localStorage.getItem("deathDate");
    if (savedDeathDate) {
      setDeathDate(savedDeathDate);
      setShowResult(true);
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
    setShowResult(true);
    handleClose();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const remainingDays = deathDate
    ? differenceInDays(new Date(deathDate), new Date())
    : 0;

  return (
    <>
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
