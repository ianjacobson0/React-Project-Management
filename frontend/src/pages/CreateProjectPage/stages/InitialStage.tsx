import { Box, Button, Typography } from "@mui/material";
import React from "react";

const InitialStage = ({
    firstTimeUser,
    setCurrentStage }:
    {
        firstTimeUser: boolean,
        setCurrentStage: React.Dispatch<React.SetStateAction<number>>
    }) => {
    return (
        <>
            <Typography variant="h4" component="h4" align="center">Create or Join a Project</Typography>
            {
                firstTimeUser &&
                <Typography variant="subtitle1" align="center">(You are not a team member on any projects)</Typography>
            }
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                marginTop="25px"
            >
                <Button variant="contained" sx={{ marginRight: "10px" }} onClick={(e) => setCurrentStage(1)}>Create</Button>
                <Button variant="contained" color="inherit">Join</Button>
            </Box>
        </>
    );
}

export default InitialStage;