import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import InitialStage from "./stages/InitialStage";
import RoleStage from "./stages/RoleStage";
import CreateStage from "./stages/CreateStage";

const CreateOrgPage = () => {
    const location = useLocation();
    const [firstTimeUser, setFirstTimeUser] = useState(location.state?.firstTimeUser || false);
    const [orgId, setOrgId] = useState(-1)
    const [currentStage, setCurrentStage] = useState(0);

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
                {currentStage === 1 && <CreateStage setOrgId={setOrgId} setCurrentStage={setCurrentStage} />}
                {currentStage === 2 && <RoleStage orgId={orgId} />}
            </Box>
        </Grid >
    );
}

export default CreateOrgPage;