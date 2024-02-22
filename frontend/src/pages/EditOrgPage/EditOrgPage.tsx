import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const EditOrgPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orgId = parseInt(location.state.orgId || "0");

    if (orgId === 0) navigate("/");

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
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                >
                    <Button
                        onClick={(e) => navigate("/inviteorganization", {
                            state: {
                                orgId: orgId
                            }
                        })}
                    >Invite</Button>
                </Box>
                <Button
                    variant="contained"
                    color="inherit"
                    onClick={(e) => navigate("/")}
                >
                    Back
                </Button>
            </Box>
        </Grid>
    );
}

export default EditOrgPage;