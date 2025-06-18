import React, { useState } from "react";
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
  Paper,
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
  onBirthDateSet: (date: Date) => void;
}

const DayIDieButton: React.FC<DayIDieButtonProps> = ({ onBirthDateSet }) => {
  const [open, setOpen] = useState(true);
  const [birthDate, setBirthDate] = useState<string>("");
  const [deathDate, setDeathDate] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showResult, setShowResult] = useState(false);

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
    onBirthDateSet(birth);
  };

  const remainingDays = deathDate
    ? differenceInDays(new Date(deathDate), new Date())
    : 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        bgcolor: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto',
        color: 'white',
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Your Life Calendar
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
        Enter your birth date to see your life calendar. Each dot represents one week of your 80-year life.
      </Typography>

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

      {showResult && deathDate && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
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
        </Box>
      )}
    </Paper>
  );
};

export default DayIDieButton;
