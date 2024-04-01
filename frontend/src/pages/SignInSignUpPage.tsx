import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import api from "../api/api";

const SignInSignUpPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isSignUp) {
            handleSignUp(event);
        } else {
            handleSignIn(event);
        }
    };

    const toggleIsSignUp = () => setIsSignUp(!isSignUp);

    const handleSignUp = (event: React.FormEvent) => {
      event.preventDefault();
  
      api.post("/user/signup", { firstName, lastName, email, password })
          .then((res) => {
              console.log(res.data);
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("userId", res.data.userId);
              localStorage.setItem("firstName", firstName); // Store the user's first name
              localStorage.setItem("lastName", lastName); // Store the user's last name
              localStorage.setItem("email", email); // Store the user's email
              window.location.href = "/profile";
          })
          .catch((err) => {
              console.error(err);
              setError("An error occurred during sign up.");
          });
  };
  
  const handleSignIn = (event: React.FormEvent) => {
      event.preventDefault();
      api.post("/user/login", { email, password })
          .then((res) => {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("userId", res.data.userId);
              // After successful login, make another request to get the user's details
              api.get(`/user/${res.data.userId}`)
                  .then((res) => {
                      localStorage.setItem("firstName", res.data.firstName); // Store the user's first name
                      localStorage.setItem("lastName", res.data.lastName); // Store the user's last name
                      localStorage.setItem("email", res.data.email); // Store the user's email
                  })
                  .catch((err) => {
                      console.error(err);
                      setError("An error occurred during sign in.");
                  });
              window.location.href = "/profile";
          })
          .catch((err) => {
              console.error(err);
              setError("Invalid email or password.");
          });
  };
  

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 10
            }}
        >
            <Typography variant="h4">
                {isSignUp ? "Sign Up" : "Sign In"}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, pt: 2 }}>
                {isSignUp && (
                    <>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            required
                            fullWidth
                            margin="normal"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            required
                            fullWidth
                            margin="normal"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </>
                )}
                <TextField
                    label="Email"
                    variant="outlined"
                    required
                    fullWidth
                    margin="normal"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    required
                    fullWidth
                    margin="normal"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
            </Box>
            <Button color="secondary" onClick={toggleIsSignUp}>
                {isSignUp
                    ? "Already have an account? Sign In"
                    : "Need an account? Sign Up"}
            </Button>
        </Box>
    );
};

export default SignInSignUpPage;
