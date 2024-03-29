import { useMutation } from "@apollo/client";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { JOIN } from "../../queries/inviteQueries";
import { FormEvent, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";

const JoinOrgPage = () => {
    const navigate = useNavigate();
    const userId = parseInt(sessionStorage.getItem("userId") || "0");

    if (userId === 0) navigate("/login");

    const [join, { loading }] = useMutation(JOIN);
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        join({
            variables: {
                input: {
                    userId: userId,
                    joinCode: code
                }
            }
        })
            .then(({ data }) => {
                if (data.join) {
                    if (data.join.success) {
                        navigate("/");
                    } else {
                        displayError(data.join.errorReason);
                    }
                }
            })
    }

    const displayError = (message: string) => {
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
            setError(false);
        }, 3000)
    }

    if (loading) {
        return <Spinner />
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
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    position: "relative"
                }}
            >
                {error &&
                    <Alert
                        severity="error"
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                        }}
                    >{errorMessage}</Alert>
                }
                <TextField
                    required
                    label="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        display: "block",
                        marginTop: "10px"
                    }}
                >
                    Join
                </Button>
            </Box>
        </Grid>
    );
}

export default JoinOrgPage;