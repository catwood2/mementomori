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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format, differenceInDays, addYears } from "date-fns";

// Life expectancy data from SSA actuarial tables
const LIFE_EXPECTANCY = {
  male: 76.1, // years
  female: 81.1, // years
};

interface DayIDieButtonProps {
  onDeathDateSet: (date: string) => void;
  onClose: () => void;
}

const DayIDieButton: React.FC<DayIDieButtonProps> = ({ onDeathDateSet, onClose }) => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");

  const calculateDeathDate = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const expectancy = LIFE_EXPECTANCY[gender];
    const death = addYears(birth, expectancy);
    const formattedDeathDate = format(death, "MMMM d, yyyy");
    
    localStorage.setItem("deathDate", formattedDeathDate);
    onDeathDateSet(formattedDeathDate);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
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
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            Enter your birth date to calculate your expected death date based on current life expectancy data.
          </Typography>

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
  );
};

export default DayIDieButton;
