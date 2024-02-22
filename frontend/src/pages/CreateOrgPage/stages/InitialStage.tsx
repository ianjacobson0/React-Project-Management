import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const InitialStage = ({
    firstTimeUser,
    setCurrentStage }:
    {
        firstTimeUser: boolean,
        setCurrentStage: React.Dispatch<React.SetStateAction<number>>
    }) => {
    const navigate = useNavigate();

    return (
        <>
            <Typography variant="h4" component="h4" align="center">Create or Join an Organization</Typography>
            {
                firstTimeUser &&
                <Typography variant="subtitle1" align="center">(You are not a  member of any organizations)</Typography>
            }
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                marginTop="25px"
            >
                <Button variant="contained" sx={{ marginRight: "10px" }} onClick={(e) => setCurrentStage(1)}>Create</Button>
                <Button
                    variant="contained"
                    color="inherit"
                    onClick={(e) => navigate("/join")}
                >Join</Button>
            </Box>
        </>
    );
}

export default InitialStage;