import React from "react";
import { useLocation } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { Box, Grid } from "@mui/material";

const ErrorPage = () => {
    const location = useLocation();
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
                padding="40px"
                borderRadius="8px"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <MdErrorOutline color="#d32f2f" size={70} />
                <p style={{ color: "#d32f2f", fontSize: "25px" }}>{location.state.errorMessage}</p>
            </Box>
        </Grid>
    );
}

export default ErrorPage;