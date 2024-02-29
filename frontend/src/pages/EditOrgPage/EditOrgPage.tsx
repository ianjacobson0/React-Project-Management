import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useQuery } from "@apollo/client";
import { QUERY_ORG_BY_ID } from "../../queries/organizationQueries";
import { useEffect, useState } from "react";

const EditOrgPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orgId = parseInt(location.state.orgId || "0");

    if (orgId === 0) navigate("/");

    const { data, loading: queryIsLoading } = useQuery(QUERY_ORG_BY_ID, {
        variables: { id: orgId },
        fetchPolicy: "network-only"
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (data && data.organization) {
            setName(data.organization.name);
            setDescription(data.organization.description);
        }
    }, [data])

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
                    component="form"
                    sx={{ marginBottom: "10px" }}
                >
                    <InputLabel>Name:</InputLabel>
                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        size="small"
                    />
                    <InputLabel>Description:</InputLabel>
                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        size="small"
                    />
                </Box>
                <div className="row">
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={(e) => navigate("/")}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={(e) => navigate("/inviteorganization", {
                            state: {
                                orgId: orgId
                            }
                        })}
                        variant="contained"
                        sx={{ marginLeft: "10px" }}
                    >Invite</Button>
                </div>
            </Box>
        </Grid>
    );
}

export default EditOrgPage;