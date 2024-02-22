import { gql, useMutation } from "@apollo/client";
import React, { FormEvent, useEffect, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Grid, Link, TextField, Typography } from "@mui/material";

const SIGN_IN = gql`
    mutation SignIn($input: SignInInput!) {
        signIn(input: $input) {
            success,
            token,
            user {
                id
            },
            error
        }
    }
`

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signIn, { loading, error }] = useMutation(SIGN_IN);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        sessionStorage.removeItem("orgId");
        sessionStorage.removeItem("projectId");
    }, [])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        signIn({
            variables: {
                input: {
                    email: email,
                    password: password
                }
            }
        }).then(({ data }) => {
            if (data.signIn.success == true) {
                sessionStorage.setItem("token", data.signIn.token)
                sessionStorage.setItem("userId", data.signIn.user.id)
                navigate("/");
            } else {
                if (data.signIn.error == "password_incorrect") {
                    displayError("Password is incorrect");
                } else if (data.signIn.error == "email_not_found") {
                    displayError("Email not found")
                }
            }
        }).catch(_ => {
            setPassword("");
        })
    }

    const displayError = (err: string) => {
        setErrorText(err);
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
            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <Typography variant="h5" component="h5" align="center">Login</Typography>
                {showError &&
                    <Alert severity="error">
                        {errorText}
                    </Alert>}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    style={{ marginTop: "5px" }}
                    display="flex"
                    flexDirection="column"
                >
                    <TextField
                        required
                        id="email"
                        label="Email"
                        variant="outlined"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ marginTop: "10px" }}
                        autoComplete="off"
                        size="small"
                    />
                    <TextField
                        required
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ marginTop: "10px" }}
                        size="small"
                    />
                    <Box my={2}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center">
                        <Button type="submit" variant="contained" size="small">Login</Button>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Link href="/register" fontSize="14px">Register</Link>
                </Box>
            </Box>
        </Grid >
    );
}

export default LoginPage;