"use client";

import React, { useState } from "react";
import { GoogleIcon, FacebookIcon } from "../../Components/customicons";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
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

import { app } from "@/firebase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

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
      return
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect or handle successful login
      window.location.href = "/"; // Redirect after successful login
    } catch (err) {
      setError(err.message);
      console.log(err.code);
      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use.");
      }
      else if (err.code === "auth/invalid-email") {
        alert("Invalid email. Please try again.");
      } 
      else if (err.code === "auth/weak-password") {
        alert("Password is too weak. Please try again.");
      } 
      else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleSignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect or handle successful login
      window.location.href = "/"; // Redirect after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUpWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect or handle successful login
      window.location.href = "/"; // Redirect after successful login
    } catch (err) {
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
              <FormLabel htmlFor="email">Email</FormLabel>
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password">Password</FormLabel>
              </Box>
              <TextField
                value={password}
                name="password"
                helperText={passwordErrorMessage}
                error={passwordError}
                color={passwordError ? 'error' : 'primary'}
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
        </Card>
      </Box>
    </Box>
  );
}
