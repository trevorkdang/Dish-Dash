"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid2,
  List,
  ListItem,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  LinearProgress,
  ListItemText,
  IconButton,
} from "@mui/material";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function UploadPage() {
  /* Video Variables */
  const [video, setVideo] = useState(null);
  /* Title Variables */
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  /* Description Variables */
  const [description, setDescription] = useState("");
  /* Cuisine Variables */
  const [cuisine, setCuisine] = useState("");
  /* Ingredients Variables */
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  /* Instructions Variables */
  const [instruction, setInstruction] = useState("");
  const [instructionsList, setInstructionsList] = useState([]);
  /* Prep Time Variables */
  const [prepTime, setPrepTime] = useState(1);
  const [prepTimeError, setPrepTimeError] = useState("");
  /* Cook Time Variables */
  const [cookTime, setCookTime] = useState(1);
  const [cookTimeError, setCookTimeError] = useState("");
  /* Serving Variables */
  const [servings, setServings] = useState(1);
  const [servingsError, setServingsError] = useState("");
  /* Tags Variables */
  const [tags, setTags] = useState([]);
  /* Restrictions Variables */
  const [restrictions, setRestrictions] = useState([]);
  /* Difficulty Variables */
  const [difficulty, setDifficulty] = useState("Medium");

  const cuisines = [
    "American",
    "Chinese",
    "Indian",
    "Italian",
    "Japanese",
    "Mexican",
    "Thai",
    "Vietnamese",
    "Mediterranean",
    "Korean",
    "Other",
  ];

  const dietaryRestrictions = [
    "Gluten-Free",
    "Vegetarian",
    "Vegan",
    "Dairy-Free",
    "Nut-Free",
    "Shellfish-Free",
    "Keto",
    "Diabetic-Friendly",
  ];

  /* Functions to handle title validation */
  const handleTitleChange = (e) => {
    const value = e.target.value;

    // Allow only alphanumeric characters and spaces
    if (value.length <= 75) {
      setTitle(value);
      setTitleError("");
    } else {
      setTitleError("Maximum 75 characters allowed");
    }
  };

  /*Functions to handle time validation*/
  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits and empty string
    if (/^\d*$/.test(value)) {
      // Changed from 'value === ""' to allow empty string directly
      const timeValue = value === "" ? "" : parseInt(value, 10); // Handle empty input case

      // Check if the parsed value is a number (not NaN)
      if (value === "") {
        // Clear the error and set time to empty when input is cleared
        if (name === "prepTime") {
          setPrepTimeError("");
          setPrepTime("");
        } else {
          setCookTimeError("");
          setCookTime("");
        }
        return;
      }

      // Validate the time range
      if (timeValue < 1 || timeValue > 720) {
        const errorMessage = "Time must be 1-720 minutes";
        name === "prepTime"
          ? setPrepTimeError(errorMessage)
          : setCookTimeError(errorMessage);
      } else {
        // Clear errors and set the valid time value
        name === "prepTime"
          ? (setPrepTimeError(""), setPrepTime(timeValue))
          : (setCookTimeError(""), setCookTime(timeValue));
      }
    } else {
      // Clear the error when invalid input is detected
      setPrepTimeError(name === "prepTime" ? "" : prepTimeError);
      setCookTimeError(name === "cookTime" ? "" : cookTimeError);
    }
  };

  /* Functions to validate servings input */
  const handleServingsChange = (e) => {
    const value = e.target.value;

    // Allow only digits and empty string
    if (value === "" || /^\d+$/.test(value)) {
      // Clear the error and set the servings value
      setServingsError("");

      // Parse the value and check if it is between 1 and 100
      const servingsValue = value === "" ? "" : parseInt(value, 10);
      if (servingsValue !== "" && (servingsValue < 1 || servingsValue > 100)) {
        // Display an error message for out-of-range values
        setServingsError("Servings must be between 1 and 100");
      } else {
        // Set the valid servings value
        setServings(servingsValue);
      }
    } else {
      // Display an error message for invalid input
      setServingsError("Servings must be a whole number");
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        mb: 2,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 800, // Set a maximum width for better alignment
        margin: "auto", // Center the layout
      }}
    >
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 2 }}>
        Bring your recipe to the world!
      </Typography>

      {/* Video Upload Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
          Upload Video
        </Typography>
        <input
          type="file"
          accept="video/*"
          style={{
            width: "100%",
            fontSize: "16px", // Adjust the font size as needed
            marginBottom: 16,
          }}
          onChange={(e) => console.log("video selected!")}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={
            <img
              src="/google-drive.svg"
              alt="Google Drive"
              style={{ width: "24px", height: "24px" }}
            />
          }
        >
          Upload from Google Drive
        </Button>

        {/* Display Progress Bar */}
        <Box alignItems="center" alignContent={"center"} sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Progress Bar
          </Typography>
          <LinearProgress variant="determinate" value={50} />
        </Box>

        {/* Video Preview */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Video Preview
          </Typography>
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            controls
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Box>

      {/* Recipe Form */}
      <Grid2 direction={"column"} container spacing={3}>
        <Grid2 item xs={12}>
          <Typography variant="h4">Recipe Details</Typography>
        </Grid2>

        {/* Title */}
        <Grid2 item xs={12}>
          <TextField
            label="Title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            error={!!titleError}
            helperText={titleError}
            fullWidth
            required
          />
        </Grid2>

        {/* Description */}
        <Grid2 item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </Grid2>

        {/* Ingredients */}
        <Grid2 item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ingredients
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Ingredient Name"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Amount"
              value={ingredientAmount}
              onChange={(e) => setIngredientAmount(e.target.value)}
              fullWidth
              required
            />
            <Button
              onClick={() => {
                if (ingredientName && ingredientAmount) {
                  const newIngredient = {
                    name: ingredientName,
                    amount: ingredientAmount,
                  };
                  setIngredientsList((prev) => [...prev, newIngredient]);
                  setIngredientName("");
                  setIngredientAmount("");
                } else {
                  alert("Please enter both ingredient name and amount.");
                }
              }}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {ingredientsList.map((ingredient, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f9f9f9",
                  borderRadius: "4px",
                  p: 0,
                  width: "auto", // Adjust the width as necessary
                }}
              >
                <ListItemText
                  primary={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {`${ingredient.amount} ${ingredient.name}`}
                      <IconButton
                        onClick={() =>
                          setIngredientsList((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        color="secondary"
                        sx={{ ml: 1 }} // Margin left for spacing
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </span>
                  }
                  primaryTypographyProps={{ color: "#333" }}
                />
              </ListItem>
            ))}
          </Box>
        </Grid2>

        {/* Instructions */}
        <Grid2 item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Instructions
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TextField
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Preheat oven to 350°F"
              sx={{ flexGrow: 1, mr: 2 }} // Allowing TextField to grow and margin right for spacing
            />
            <Button
              onClick={() => {
                if (instruction) {
                  setInstructionsList((prev) => [...prev, instruction]);
                  setInstruction("");
                } else {
                  alert("Please enter an instruction.");
                }
              }}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Box>

          <List>
            {instructionsList.map((step, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #e0e0e0", // Add a subtle bottom border
                  p: 1, // Add padding for better spacing
                }}
              >
                <ListItemText
                  primary={`${index + 1}. ${step}`}
                  primaryTypographyProps={{
                    fontWeight: "medium",
                    color: "#333",
                  }} // Slightly bolder font
                />
                <Button
                  onClick={() =>
                    setInstructionsList((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  color="secondary"
                  variant="outlined" // Use outlined style for the button
                  sx={{ ml: 2 }} // Add margin left for spacing
                >
                  Remove
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid2>

        {/* Time & Servings */}
        <Typography variant="h6" sx={{ mb: -1 }}>
          Other Details
        </Typography>

        <Grid2 container spacing={2}>
          {/* Prep Time */}
          <Grid2 item xs={12} sm={4}>
            <TextField
              label="Prep Time (minutes)"
              name="prepTime"
              value={prepTime}
              onChange={handleTimeChange}
              error={!!prepTimeError}
              helperText={prepTimeError}
              fullWidth
              required
            />
          </Grid2>

          {/* Cook Time */}
          <Grid2 item xs={12} sm={4}>
            <TextField
              label="Cook Time (minutes)"
              name="cookTime"
              value={cookTime}
              onChange={handleTimeChange}
              error={!!cookTimeError}
              helperText={cookTimeError}
              fullWidth
              required
            />
          </Grid2>

          {/* Servings */}
          <Grid2 item xs={12} sm={4}>
            <TextField
              label="Servings"
              name="servings"
              value={servings}
              onChange={handleServingsChange}
              error={!!servingsError}
              helperText={servingsError}
              fullWidth
              required
            />
          </Grid2>
        </Grid2>

        {/* Tags */}
        <Grid2 item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            multiple
            options={[]}
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Tags" fullWidth />
            )}
          />
        </Grid2>

        {/* Difficulty */}
        <Grid2 item xs={12}>
          <FormControl fullWidth>
            <FormLabel
              component="legend"
              sx={{
                typography: "h6", // Apply the Typography h6 variant (or another variant)
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Matches the default Typography font
                color: "text.primary", // Matches the default Typography color
                mb: 2,
              }}
            >
              Difficulty
            </FormLabel>
            <ToggleButtonGroup
              value={difficulty}
              exclusive
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setDifficulty(newValue);
                }
              }}
              sx={{ display: "flex", width: "100%" }} // Ensure the group takes full width
            >
              <ToggleButton
                value="Easy"
                sx={{
                  flex: 1,
                  minWidth: "100px", // Set a minimum width for consistent size
                  height: "60px", // Set a fixed height
                  backgroundColor: "green",
                  color: "white",
                  transition: "transform 0.2s, background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "green", // Keep the same color when hovering
                    opacity: 0.8, // Optional: Slightly adjust the opacity for visual feedback
                  },
                  "&.Mui-selected": {
                    backgroundColor: "darkgreen", // Keep the same color when selected
                    color: "white", // Ensure the text color remains white
                    transform: "scale(1.1)", // Slightly increase size when selected
                    zIndex: 1, // Ensure the selected button is on top
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "darkgreen", // Keep the same color on hover when selected
                    opacity: 1, // Ensure the color remains consistent
                  },
                }}
              >
                Easy
              </ToggleButton>

              <ToggleButton
                value="Medium"
                sx={{
                  flex: 1,
                  minWidth: "100px", // Set a minimum width for consistent size
                  height: "60px", // Set a fixed height
                  backgroundColor: "orange",
                  color: "white",
                  transition: "transform 0.2s, background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "orange", // Keep the same color when hovering
                    opacity: 0.8, // Optional: Slightly adjust the opacity for visual feedback
                  },
                  "&.Mui-selected": {
                    backgroundColor: "darkorange", // Keep the same color when selected
                    color: "white", // Ensure the text color remains white
                    transform: "scale(1.1)", // Slightly increase size when selected
                    zIndex: 1, // Ensure the selected button is on top
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "darkorange", // Keep the same color on hover when selected
                    opacity: 1, // Ensure the color remains consistent
                  },
                }}
              >
                Medium
              </ToggleButton>

              <ToggleButton
                value="Hard"
                sx={{
                  flex: 1,
                  minWidth: "100px", // Set a minimum width for consistent size
                  height: "60px", // Set a fixed height
                  backgroundColor: "red",
                  color: "white",
                  transition: "transform 0.2s, background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "red", // Keep the same color when hovering
                    opacity: 0.8, // Optional: Slightly adjust the opacity for visual feedback
                  },
                  "&.Mui-selected": {
                    backgroundColor: "darkred", // Keep the same color when selected
                    color: "white", // Ensure the text color remains white
                    transform: "scale(1.1)", // Slightly increase size when selected
                    zIndex: 1, // Ensure the selected button is on top
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "darkred", // Keep the same color on hover when selected
                    opacity: 1, // Ensure the color remains consistent
                  },
                }}
              >
                Hard
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Grid2>

        {/* Submit Button */}
        <Grid2 item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              // Handle submission logic
              console.log("Form submitted!");
              alert("Recipe submitted!"); // Replace with actual logic
            }}
          >
            Submit Recipe
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
}
