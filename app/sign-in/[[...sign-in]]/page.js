"use client";

import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signOut,
  } from "firebase/auth";
  import { getAuth } from "firebase/auth";
import { Box, Container, Typography, Button, TextField } from '@mui/material';
import { app } from '@/firebase';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const auth = getAuth(app);

    const handleSignInWithEmail = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect or handle successful login
            window.location.href = '/'; // Redirect after successful login
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSignInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Redirect or handle successful login
            window.location.href = '/'; // Redirect after successful login
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSignInWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Redirect or handle successful login
            window.location.href = '/'; // Redirect after successful login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box bgcolor="#121212" height="100vh">
            <Container maxWidth="xs">
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                    <Typography variant="h4" gutterBottom sx={{ mt: 4, color: "white", textShadow: "0px 0px 10px #00FF00", fontWeight: "bold" }}>
                        Sign In
                    </Typography>
                    <form onSubmit={handleSignInWithEmail}>
                        <TextField
                            variant="outlined"
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ input: { color: "white" }, label: { color: "white" }, borderColor: "#00FF00" }}
                        />
                        <TextField
                            variant="outlined"
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ input: { color: "white" }, label: { color: "white" }, borderColor: "#00FF00" }}
                        />
                        {error && <Typography color="red">{error}</Typography>}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ bgcolor: "#DB4437", mt: 2, mb: 2}}>
                            Sign In with Email
                        </Button>
                    </form>
                    <Button onClick={handleSignInWithGoogle} variant="contained" color="primary" fullWidth sx={{ bgcolor: "#00FF00", mt: 2 }}>
                        Sign In with Google
                    </Button>
                    <Button onClick={handleSignInWithFacebook} variant="contained" color="primary" fullWidth sx={{ bgcolor: "#4267B2", mt: 2 }}>
                        Sign In with Facebook
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}