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
  Autocomplete,
} from "@mui/material";

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
        const errorMessage = "Time must be between 1 and 720 minutes";
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
    <Box align="center" sx={{ padding: 4, mb: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upload Your Recipe Video
      </Typography>

      {/* Video Upload Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          Upload Video
        </Typography>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            console.log("video selected!");
          }}
          style={{ marginBottom: "16px" }}
        />
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Upload from Google Drive
        </Button>
      </Box>

      {/* Recipe Section */}
      <Box>
        <Grid2 container direction="column" spacing={3}>
          {/* Title */}
          <Grid2 item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={title}
              onChange={(e) => handleTitleChange(e)}
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
              required
            />
          </Grid2>

          {/* Cuisine */}
          <Grid2 item xs={12}>
            <Autocomplete
              disablePortal
              options={cuisines}
              onChange={(event, newValue) => setCuisine(newValue)}
              renderInput={(params) => (
                <TextField {...params} required label="Cuisine" />
              )}
            />
          </Grid2>

          {/* Ingredients */}
          <Grid2 item xs={12}>
            {/* Ingredient Name */}
            <TextField
              label="Ingredient Name"
              placeholder="Flour"
              value={ingredientName}
              onChange={(event) => setIngredientName(event.target.value)}
              fullWidth
              required
            />

            {/* Input for Amount */}
            <TextField
              label="Amount"
              placeholder="2 cups"
              value={ingredientAmount}
              onChange={(event) => setIngredientAmount(event.target.value)}
              fullWidth
              required
            />

            {/* Button to Add Ingredient */}
            <Button
              onClick={() => {
                if (ingredientName && ingredientAmount) {
                  // Combine the ingredient name and amount and add to the ingredients list
                  const newIngredient = {
                    name: ingredientName,
                    amount: ingredientAmount,
                  };
                  setIngredientsList((prevList) => [
                    ...prevList,
                    newIngredient,
                  ]);
                  // Clear inputs after adding
                  setIngredientName("");
                  setIngredientAmount("");
                } else {
                  alert("Please enter both ingredient name and amount.");
                }
              }}
            >
              Add Ingredient
            </Button>

            {/* Display Ingredients List */}
            <Typography variant="h6" gutterBottom>
              Ingredients List
            </Typography>
            <Autocomplete
              multiple
              options={[]} // No predefined options for the ingredients list
              slotProps={{ input: { readonly: true } }} // Prevent typing in the input field
              value={ingredientsList.map(
                (ingredient) => `${ingredient.amount} ${ingredient.name}`
              )} // Display the list of added ingredients
              onChange={(event, newValue) => {
                // Split the newValue back into ingredient objects
                const newIngredients = newValue.map((item) => {
                  const [amount, ...nameParts] = item.split(" ");
                  const name = nameParts.join(" ");
                  return { amount, name };
                });

                // Update the ingredients list with new values
                setIngredientsList(newIngredients);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Ingredients List" fullWidth />
              )}
              renderOption={() => null} // Disable rendering of any dropdown options
              noOptionsText="" // Ensure no "No options" message is displayed
            />
          </Grid2>

          {/* Instructions */}
          <Grid2 item xs={12}>
            <TextField
              label="Instruction Step"
              placeholder="Preheat the oven..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)} // Update state with input
              fullWidth
            />
            <Button
              onClick={() => {
                setInstructionsList([...instructionsList, instruction]);
                setInstruction("");
              }}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Add Instruction
            </Button>

            <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
              Instructions List
            </Typography>

            <List>
              {instructionsList.map((step, index) => (
                <ListItem key={index}>
                  <Typography variant="body1">{`${
                    index + 1
                  }. ${step}`}</Typography>
                  <Button
                    onClick={() => {
                      setInstructionsList(
                        instructionsList.filter((_, i) => i !== index)
                      );
                    }}
                    color="secondary"
                    style={{ marginLeft: 8 }}
                  >
                    Remove
                  </Button>
                </ListItem>
              ))}
            </List>
          </Grid2>

          {/* Prep Time */}
          <Grid2 item xs={12}>
            <TextField
              label="Prep Time (minutes)"
              name="prepTime"
              value={prepTime}
              onChange={(e) => handleTimeChange(e)}
              error={!!prepTimeError}
              helperText={prepTimeError}
              fullWidth
              required
            />
          </Grid2>

          {/* Cook Time */}
          <Grid2 item xs={12}>
            <TextField
              label="Cook Time (minutes)"
              name="cookTime"
              value={cookTime}
              onChange={(e) => handleTimeChange(e)}
              error={!!cookTimeError}
              helperText={cookTimeError}
              fullWidth
              required
            />
          </Grid2>

          {/* Servings */}
          <Grid2 item xs={12}>
            <TextField
              label="Servings"
              name="servings"
              value={servings}
              onChange={(e) => handleServingsChange(e)}
              error={!!servingsError}
              helperText={servingsError}
              fullWidth
              required
            />
          </Grid2>

          {/* Tags */}
          <Grid2 item xs={12}>
            <Autocomplete
              freeSolo
              multiple
              options={[]} // No predefined options
              value={tags.map((tag) => tag)} // Display the list of added tags
              onChange={(event, newValue) => setTags(newValue)} // Update the tags list
              renderInput={(params) => (
                <TextField {...params} label="Tags" name="tags" fullWidth />
              )}
            />
          </Grid2>

          {/* Dietary Restrictions */}
          <Grid2 item xs={12}>
            <Autocomplete
              multiple
              options={dietaryRestrictions}
              value={restrictions.map((restriction) => restriction)} // Display the list of added restrictions
              onChange={(event, newValue) => setRestrictions(newValue)} // Update the restrictions list
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dietary Restrictions"
                  name="restrictions"
                  fullWidth
                />
              )}
            />
          </Grid2>

          {/* Difficulty */}
          <Grid2 item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={difficulty}
                onChange={(event) => {
                  setDifficulty(event.target.value);
                }}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          {/* Submit Button */}
          <Grid2 item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                // Handle submission logic here
                console.log("Form submitted:");
                alert("Recipe submitted!"); // Add any further submission logic needed
              }}
            >
              Submit Recipe
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
