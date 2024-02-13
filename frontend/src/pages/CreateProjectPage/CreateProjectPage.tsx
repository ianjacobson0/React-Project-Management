import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import InitialStage from "./stages/InitialStage";
import { useLocation } from "react-router-dom";
import CreateStage from "./stages/CreateStage";
import RoleStage from "./stages/RoleStage";

const CreateProjectPage = () => {
    const location = useLocation();
    const [firstTimeUser, setFirstTimeUser] = useState(location.state?.firstTimeUser || false);
    const [currentStage, setCurrentStage] = useState(0);
    const [projectId, setProjectId] = useState(0);

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: "100vh"
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                padding="20px"
                sx={{ backgroundColor: "white", borderRadius: "20px" }}
            >
                {currentStage === 0 && <InitialStage firstTimeUser={firstTimeUser} setCurrentStage={setCurrentStage} />}
                {currentStage === 1 && <CreateStage setProjectId={setProjectId} setCurrentStage={setCurrentStage} />}
                {currentStage === 2 && <RoleStage projectId={projectId} />}
            </Box>
        </Grid>
    );
}

export default CreateProjectPage;