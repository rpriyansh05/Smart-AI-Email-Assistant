import { useState, useMemo } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LightMode, DarkMode } from "@mui/icons-material";
import axios from "axios";
import "./App.css";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
          background: {
            default: darkMode ? "#121212" : "#f5f7fa",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "Poppins, Roboto, sans-serif",
        },
      }),
    [darkMode]
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === "string" ? response.data : JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Error generating reply:", error);
      setGeneratedReply("Error generating reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(generatedReply)
      .then(() => alert("Copied to clipboard!"))
      .catch(() => alert("Failed to copy."));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" fontWeight="bold">
              ✉️ Email Reply Generator
            </Typography>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="primary"
              sx={{ transition: "all 0.3s" }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>

          {/* Input Section */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Original Email Content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              disabled={!emailContent || loading}
              onClick={handleSubmit}
              sx={{ alignSelf: "flex-start" }}
            >
              {loading ? <CircularProgress size={24} /> : "Generate Reply"}
            </Button>
          </Box>

          {/* Output Section */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Generated Reply
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={generatedReply}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              variant="outlined"
              onClick={handleCopy}
              sx={{ mt: 2, alignSelf: "flex-start" }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;




