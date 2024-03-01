import { gql, useMutation } from "@apollo/client";
import { Alert, Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const SIGN_UP = gql`
    mutation SignUp($input: SignUpInput!) {
        signUp(input: $input) {
            success,
            token,
            user {
                id
            },
            error
        }
    }
`

const RegisterPage = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [retypePasswordError, setRetypePasswordError] = useState(false);
    const [signUp, { loading, error }] = useMutation(SIGN_UP);
    const [showError, setShowError] = useState(false);

    const validateEmail = (email: string) => {
        let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        return regex.test(email);
    }

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return false;
        } else {
            return true;
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        let inputError = false;
        if (!validateEmail(email)) {
            setEmailError(true);
            inputError = true;
        } else {
            setEmailError(false);
        }
        if (!validatePassword(password)) {
            setPasswordError(true);
            inputError = true;
        } else {
            setPasswordError(false);
        }
        if (password != retypePassword) {
            setRetypePasswordError(true);
            inputError = true;
        } else {
            setRetypePasswordError(false);
        }

        if (!inputError) {
            signUp({
                variables: {
                    input: {
                        email: email,
                        password: password,
                        fullName: fullName
                    }
                }
            })
                .then(({ data }) => {
                    if (data.signUp.success) {
                        navigate("/login");
                    } else {
                        if (data.signUp.error == "duplicate_email") {
                            setEmailError(true);
                            setEmail("");
                            displayError();
                        }
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        }
    }

    const displayError = () => {
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 5000)
    }

    if (error) {
        navigate("/error", { state: { errorMessage: error.message } });
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", height: "100%" }}
        >
            {loading && <Spinner />}
            <Box sx={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "10px"
            }}
            >
                <Typography variant="h5" component="h5" align="center">Register</Typography>
                {showError &&
                    <Alert severity="error">
                        Email is taken
                    </Alert>}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    style={{ marginTop: "5px" }}
                    display="flex"
                    flexDirection="column"
                >
                    <TextField
                        id="fullName"
                        label="Full Name"
                        variant="outlined"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        sx={{ marginTop: "10px" }}
                        autoComplete="off"
                        size="small"
                    />
                    <TextField
                        required
                        id="email"
                        label="Email"
                        variant="outlined"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        sx={{ marginTop: "10px" }}
                        autoComplete="off"
                        size="small"
                    />
                    {emailError &&
                        <Typography variant="caption" color="error">
                            Invalid email address
                        </Typography>}
                    <TextField
                        required
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        sx={{ marginTop: "10px" }}
                        size="small"
                    />
                    {passwordError &&
                        <Typography variant="caption" color="error">
                            Password must be at least 8 characters
                        </Typography>}
                    <TextField
                        required
                        id="retype-password"
                        label="Retype Password"
                        variant="outlined"
                        type="password"
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        error={retypePasswordError}
                        sx={{ marginTop: "10px" }}
                        size="small"
                    />
                    {retypePasswordError &&
                        <Typography variant="caption" color="error">
                            Passwords must match
                        </Typography>}
                    <Box my={2}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center">
                        <Button type="submit" variant="contained" size="small">Register</Button>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Link href="/login" fontSize="14px">Login</Link>
                </Box>
            </Box>
        </Grid >
    );
}

export default RegisterPage;