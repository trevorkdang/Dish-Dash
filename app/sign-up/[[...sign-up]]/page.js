"use client";

import React, { useState } from "react";
import { GoogleIcon, FacebookIcon } from "../../Components/customicons";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { writeBatch, doc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  FormControl,
  FormLabel,
  Link,
  Divider,
} from "@mui/material";
import { updateProfile } from "firebase/auth";

import { app, db } from "@/firebase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const [signUpWithProvider, setSignUpWithProvider] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  // we can change later to make it an API call
  const addNewUser = async () => {
    const displayName = signUpWithProvider
      ? userInfo.displayName
      : firstName + " " + lastName;
    const picURL = signUpWithProvider
      ? userInfo.photoURL
      : "https://www.gravatar.com/avatar/?d=mp";

    let userDocRef;

    try {
      const batch = writeBatch(db);
      userDocRef = doc(collection(db, "users"), displayName);

      // adjust user profile data as necessary
      const newUser = {
        ID: userInfo.uid,
        name: displayName,
        email: userInfo.email,
        photoURL: picURL,
        username: username,
      };
      batch.set(userDocRef, newUser);

      // Commit the batch
      await batch.commit();
    } catch (error) {
      console.error("Error adding user to db:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const auth = getAuth(app);

  const handleSignUpWithEmail = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      return;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    setError("");

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const creationTimestamp = result.user.metadata.createdAt;
      const currentTimestamp = Date.now();
      const isNewUser = currentTimestamp - creationTimestamp < 5000;
      if (isNewUser) {
        // Await the result of adding the new user to your database
        //await addNewUser(result.user, true);
        setUserCreated(true);
        setSignUpWithProvider(false);
        setUserInfo(result.user);
      }
      //window.location.href = "/"; // Redirect after successful login (if needed)
    } catch (err) {
      setError(err.message);

      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use.");
      } else if (err.code === "auth/invalid-email") {
        alert("Invalid email. Please try again.");
      } else if (err.code === "auth/weak-password") {
        alert("Password is too weak. Please try again.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Await the result of the sign-in popup
      const result = await signInWithPopup(auth, provider);

      // Get the creation and current timestamp
      const creationTimestamp = new Date(
        result.user.metadata.creationTime
      ).getTime(); // Use .creationTime and convert it to a timestamp
      const currentTimestamp = Date.now();

      // Check if the user is new based on timestamp difference
      const isNewUser = currentTimestamp - creationTimestamp < 5000;

      if (isNewUser) {
        // Await the result of adding the new user to your database
        //await addNewUser(result.user, true);
        setUserCreated(true);
        setSignUpWithProvider(true);
        setUserInfo(result.user);
      } else {
        window.location.href = "/"; // Redirect after successful login (if needed)
      }
    } catch (err) {
      // Handle errors
      setError(err.message);
    }
  };

  const handleSignUpWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();

      // Await the result of the sign-in popup
      const result = await signInWithPopup(auth, provider);

      // Get the creation and current timestamp
      const creationTimestamp = new Date(
        result.user.metadata.creationTime
      ).getTime(); // Use .creationTime and convert it to a timestamp
      const currentTimestamp = Date.now();

      // Check if the user is new based on timestamp difference
      const isNewUser = currentTimestamp - creationTimestamp < 5000;

      if (isNewUser) {
        // Await the result of adding the new user to your database
        //await addNewUser(result.user, true);
        setUserCreated(true);
        setSignUpWithProvider(true);
        setUserInfo(result.user);
      } else {
        window.location.href = "/"; // Redirect after successful login (if needed)
      }
    } catch (err) {
      // Handle errors
      setError(err.message);
      console.log(err.code);
    }
  };

  const handleCompleteProfile = async () => {
    // Trim whitespace from firstName and lastName if signUpWithProvider is false
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();

    // Validate username length
    if (!username || username.length < 5) {
      alert("Username must be at least 5 characters long.");
      return;
    }

    // Ensure both firstName and lastName are entered if not signing up with a provider
    if (!signUpWithProvider && (!trimmedFirstName || !trimmedLastName)) {
      alert("Please enter your first and last name.");
      return;
    }

    try {
      const user = auth.currentUser;
      // Proceed with adding the new user to your database
      await addNewUser();
      if (!signUpWithProvider) {
        // Update the user's display name if not signing up with a provider
        if (user) {
          updateProfile(user, {
            displayName: firstName + " " + lastName, // Change display name
            photoURL: "https://www.gravatar.com/avatar/?d=mp" // Default profile pic
          })
            .then(() => {
              console.log("Profile updated successfully!");
            })
            .catch((error) => {
              console.error("Error updating profile:", error);
            });
        }
      }
      // Redirect after successful login (if needed)
      //window.location.href = "/";
    } catch (err) {
      // Handle any errors that might occur during the process
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Ensures vertical centering
        padding: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 400, // Set the desired max width
          width: "100%", // Ensure it takes up the full width until the max width is reached
          padding: 3, // Optional padding inside the container
        }}
      >
        <Card>
          {!userCreated ? (
            <>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  width: "100%",
                  fontSize: "clamp(2rem, 10vw, 2.15rem)",
                }}
              >
                Sign Up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSignUpWithEmail}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="email" sx={{ ml: 1 }}>
                    Email
                  </FormLabel>
                  <TextField
                    value={email}
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? "error" : "primary"}
                    sx={{ ariaLabel: "email" }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormLabel htmlFor="password" sx={{ ml: 1 }}>
                      Password
                    </FormLabel>
                  </Box>
                  <TextField
                    value={password}
                    name="password"
                    helperText={passwordErrorMessage}
                    error={passwordError}
                    color={passwordError ? "error" : "primary"}
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSignUpWithEmail}
                >
                  Sign up
                </Button>
                <Typography sx={{ textAlign: "center" }}>
                  Already have an account?{" "}
                  <span>
                    <Link
                      href="/sign-in"
                      variant="body2"
                      sx={{ alignSelf: "center" }}
                    >
                      Sign in
                    </Link>
                  </span>
                </Typography>
              </Box>
              <Divider>or</Divider>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={handleSignUpWithGoogle}
                  startIcon={<GoogleIcon />}
                >
                  Sign up with Google
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={handleSignUpWithFacebook}
                  startIcon={<FacebookIcon />}
                >
                  Sign up with Facebook
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                component="h1"
                variant="h4"
                sx={{ textAlign: "center", mb: 2 }}
              >
                Complete Your Profile
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {!signUpWithProvider && (
                  <>
                    <FormControl>
                      <FormLabel htmlFor="firstName" sx={{ ml: 1 }}>
                        First Name
                      </FormLabel>
                      <TextField
                        value={firstName}
                        id="firstName"
                        placeholder="First Name"
                        required
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="lastName" sx={{ ml: 1 }}>
                        Last Name
                      </FormLabel>
                      <TextField
                        value={lastName}
                        id="lastName"
                        placeholder="Last Name"
                        required
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </FormControl>
                  </>
                )}
                <FormControl>
                  <FormLabel htmlFor="username" sx={{ ml: 1 }}>
                    Username
                  </FormLabel>
                  <TextField
                    value={username}
                    id="username"
                    placeholder="Username"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={handleCompleteProfile}
                >
                  Save & Continue
                </Button>
              </Box>
            </>
          )}
        </Card>
      </Box>
    </Box>
  );
}
