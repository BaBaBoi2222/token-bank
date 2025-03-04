import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Delete } from "@mui/icons-material";

const Saved = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenTokens, setHiddenTokens] = useState({});
  const [deletingToken, setDeletingToken] = useState(null); // State for tracking deletion

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/getT", {
          headers: {
            authorization: `${localStorage.getItem("token")}`,
            email: localStorage.getItem("loggedInMail"),
          },
        });

        if (response.data.success) {
          setTokens(response.data.message);
          setHiddenTokens(
            response.data.message.reduce((acc, token) => {
              acc[token._id] = true;
              return acc;
            }, {})
          );
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Function to handle delete confirmation
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete '${name}'?`);
    if (!confirmDelete) return;
    setDeletingToken({ id, name });
  };

  // useEffect to perform deletion when deletingToken is set
  useEffect(() => {
    if (!deletingToken) return;

    const deleteToken = async () => {
      try {
        await axios.delete(
          `http://localhost:8080/auth/deleteT/${localStorage.getItem('loggedInMail')}/${deletingToken.name}`,
          {
            headers: { authorization: `${localStorage.getItem("token")}` },
          }
        );

        setTokens((prevTokens) => prevTokens.filter((token) => token._id !== deletingToken.id));
        setHiddenTokens((prev) => {
          const newState = { ...prev };
          delete newState[deletingToken.id];
          return newState;
        });
      } catch (error) {
        console.error("Error deleting token:", error);
      } finally {
        setDeletingToken(null); // Reset state after deletion
      }
    };

    deleteToken();
  }, [deletingToken]);

  const toggleVisibility = (id) => {
    setHiddenTokens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: "600px",
          minHeight: "80vh",
          p: 2,
          borderRadius: 3,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 2, fontWeight: "bold", color: "primary.light" }}
        >
          Saved Tokens
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "primary.light" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Token</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.length > 0 ? (
                  tokens.map(({ name, value, _id }) => (
                    <TableRow key={_id} sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                      <TableCell>{name}</TableCell>
                      <TableCell
                        sx={{
                          wordBreak: "break-all", // Ensures long tokens wrap within the cell
                          whiteSpace: "normal", // Allows multi-line wrapping
                          maxWidth: "300px", // Set a reasonable max width
                          fontFamily: "monospace",
                        }}
                      >
                        {hiddenTokens[_id] ? "•".repeat(value.length) : value}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={hiddenTokens[_id] ? "Show" : "Hide"}>
                          <IconButton onClick={() => toggleVisibility(_id)} color="primary">
                            {hiddenTokens[_id] ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(_id, name)} color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ color: "text.secondary" }}>
                      No tokens available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Saved;
