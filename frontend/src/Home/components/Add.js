import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box, useTheme, Alert } from "@mui/material";
import axios from "axios";

const Add = ({ onTokenAdded }) => {
  const theme = useTheme(); // Get theme colors

  const [formData, setFormData] = useState({
    tokName: "",
    tok: "",
    email: localStorage.getItem('loggedInMail'),
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("https://token-bank-phi.vercel.app/auth/addT", formData);

      if (response.data.success) {
        setMessage({ type: "success", text: "Token added successfully!" });
        setFormData({ tokName: "", tok: "", email: localStorage.getItem('loggedInMail')}); // Reset form
        if (onTokenAdded) onTokenAdded(response.data);
      } else {
        setMessage({ type: "error", text: response.data.message || "Failed to add token." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add token. Please try again." });
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        bgcolor: (theme.vars || theme).palette.background.paper,
        color: theme.palette.text.primary,
        p: 4,
        minWidth: "50vw",
        maxWidth: 450,
        mx: "auto",
        mt: 5,
        borderRadius: 3,
        boxShadow: theme.shadows[5],
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
        Add Token
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Token Name"
          name="tokName"
          value={formData.tokName}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          sx={{ "& .MuiInputBase-root": { bgcolor: theme.palette.background.default } }}
        />
        <TextField
          label="Token Value"
          name="tok"
          value={formData.tok}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          sx={{ "& .MuiInputBase-root": { bgcolor: theme.palette.background.default } }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            "&:hover": { bgcolor: theme.palette.primary.light },
            borderRadius: 3,
            fontWeight: "bold",
            py: 1.2,
            fontSize: "1rem",
          }}
        >
          Add Token
        </Button>
      </Box>
    </Paper>
  );
};

export default Add;
