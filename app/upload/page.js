"use client";

import { useState, useEffect, use } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
} from "@mui/material";
import useDrivePicker from "react-google-drive-picker";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { app, db, auth } from "@/firebase";
import { writeBatch, doc, collection } from "firebase/firestore";

export default function UploadPage() {
  /* User Info */
  const user = auth.currentUser;
  /* Video Variables */
  const [video, setVideo] = useState({});
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
  const [prepTime, setPrepTime] = useState(10);
  const [prepTimeError, setPrepTimeError] = useState("");
  /* Cook Time Variables */
  const [cookTime, setCookTime] = useState(30);
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

  /* Submission Dialog */
  const [openDialog, setOpenDialog] = useState(false);

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

  /* Function to upload form to DB*/
  const generateRandomId = async (length = 8) => {
    return Math.random()
      .toString(36)
      .slice(2, 2 + length);
  };

  const uploadVideo = async () => {
    const userID = user ? user.uid : "";
    const displayName = user ? user.displayName : "";
    const lastName = displayName ? displayName.split(" ").pop() : "";

    try {
      const batch = writeBatch(db);
      const videoId = await generateRandomId();
      const videoDocRef = doc(collection(db, "videos"), lastName + " " + title);

      const newVideo = {
        id: videoId,
        title: title,
        description: description,
        creator: {
          user_id: userID,
          name: displayName,
        },
        video_url: "video_url", // get from video file
        thumbnail_url: "thumbnail_url", // get from mux
        tags: tags,
        cuisine: cuisine,
        dietary_restrictions: restrictions,
        difficulty: difficulty,
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: [],
        average_rating: 0,
        ratings_count: 0,
        total_time: prepTime + cookTime,
      };
      batch.set(videoDocRef, newVideo);

      await batch.commit();
    } catch (error) {
      console.error("Error adding video to db:", error);
    }
  };

  const uploadRecipe = async () => {
    const userID = user ? user.uid : "";
    const displayName = user ? user.displayName : "";
    const lastName = displayName ? displayName.split(" ").pop() : "";

    try {
      const batch = writeBatch(db);
      const recipeId = await generateRandomId();
      const recipeDocRef = doc(
        collection(db, "recipes"),
        lastName + " " + title
      );

      const newRecipe = {
        id: recipeId,
        title: title,
        description: description,
        creator: {
          user_id: userID,
          name: displayName,
        },
        ingredients: ingredientsList,
        instructions: instructionsList,
        prep_time: prepTime,
        cook_time: cookTime,
        total_time: prepTime + cookTime,
        servings: servings,
        tags: tags,
        cuisine: cuisine,
        dietary_restrictions: restrictions,
        difficulty: difficulty,
        comments: [],
        average_rating: 0,
        ratings_count: 0,
      };
      batch.set(recipeDocRef, newRecipe);

      await batch.commit();
    } catch (error) {
      console.error("Error adding recipe to db:", error);
    }
  };

  const submitForm = async () => {
    // if (!video) {
    //   alert("Please upload a video for your recipe.");
    //   return;
    // }

    if (!title) {
      alert("Please enter a title for your recipe.");
      return;
    }

    if (!cuisine) {
      alert("Please select a cuisine for your recipe.");
      return;
    }

    if (ingredientsList.length === 0) {
      alert("Please add ingredients to your recipe.");
      return;
    }

    if (instructionsList.length === 0) {
      alert("Please add instructions to your recipe.");
      return;
    }

    if (prepTime === "") {
      alert("Please enter a prep time for your recipe.");
      return;
    }

    if (cookTime === "") {
      alert("Please enter a cook time for your recipe.");
      return;
    }

    if (servings === "") {
      alert("Please enter the number of servings for your recipe.");
      return;
    }

    Promise.all([uploadVideo(), uploadRecipe()])
      .then(() => {
        console.log("Both uploads completed successfully.");
        setOpenDialog(true);
      })
      .catch((error) => {
        console.error("An error occurred during uploads:", error.message);
      });
  };

  /* Functions to handle video upload */
  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      viewId: "DOCS_VIDEOS", // Keep this to view videos
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data) => {
        pickerCallback(data);
      },
    });
  };

  const pickerCallback = (data) => {
    if (
      data[window.google.picker.Response.ACTION] ===
      window.google.picker.Action.PICKED
    ) {
      // Extract selected file information
      const video = data[window.google.picker.Response.DOCUMENTS][0]; // Get the first selected file
      console.log("Picked file:", video); // Log the selected file info
      setVideo({ source: "google-drive", file: video }); // Set the selected video
    }
  };

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleVideoView = () => {
    // Redirect to the video page
    setOpenDialog(false);
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
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
        Bring your recipe to the world!
      </Typography>

      {/* Video Upload Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
          Upload Video
        </Typography>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <input
              type="file"
              accept="video/*"
              style={{
                flex: 1,
                fontSize: "16px",
                marginRight: 4,
                maxWidth: "300px",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenPicker()}
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
          </Box>
        </Box>

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
          <Typography variant="h4">Recipe</Typography>
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

        {/* Cuisine */}
        <Grid2 item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Cuisine
          </Typography>
          <FormControl fullWidth>
            <Autocomplete
              id="cuisine"
              options={cuisines}
              value={cuisine}
              onChange={(event, newValue) => {
                setCuisine(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cuisine"
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
              fullWidth
            />
          </FormControl>
        </Grid2>

        {/* Ingredients */}
        <Grid2 item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ingredients
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Name"
              placeholder="Flour"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Amount"
              placeholder="2 cups"
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={instruction}
              label="Instruction"
              required
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

        {/* Dietary Restrictions */}
        <Grid2 item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Dietary Restrictions
          </Typography>
          <FormControl fullWidth>
            <Autocomplete
              id="dietary restrictions"
              options={dietaryRestrictions}
              multiple
              value={restrictions}
              onChange={(event, newValue) => {
                setRestrictions(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dietary Restrictions"
                  variant="outlined"
                  fullWidth
                />
              )}
              fullWidth
            />
          </FormControl>
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
              submitForm();
            }}
          >
            Upload
          </Button>
        </Grid2>
      </Grid2>

      {/* Submission Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          🎉 Video Uploaded Successfully!
        </DialogTitle>
        <DialogContent>
          <div style={{ textAlign: "center", padding: "10px 20px", mb: 5 }}>
            <p style={{ fontSize: "1.1em", fontWeight: "500" }}>
              Your submission was successful!
            </p>
            <p style={{ fontSize: "1em", color: "#555", fontWeight: "400" }}>
              What would you like to do next?
            </p>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleVideoView}
            variant="contained"
            color="primary"
            style={{ margin: "0 10px" }}
          >
            View Video
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            variant="outlined"
            color="secondary"
            style={{ margin: "0 10px" }}
          >
            Go to Home Page
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
