import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Grid, InputLabel, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QUERY_ORG_BY_ID, UPDATE_ORG } from "../../queries/organizationQueries";

const EditOrgPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orgId = parseInt(location.state.orgId || "0");

    if (orgId === 0) navigate("/");

    const { data, loading: queryIsLoading } = useQuery(QUERY_ORG_BY_ID, {
        variables: { id: orgId },
        fetchPolicy: "network-only"
    });
    const [updateOrganization, {loading}] = useMutation(UPDATE_ORG);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (data && data.organization) {
            setName(data.organization.name);
            setDescription(data.organization.description);
        }
    }, [data])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateOrganization({
            variables: {
                input: {
                    id: orgId,
                    name: name,
                    description: description
                }
            }
        })
            .then(() => navigate("/"))
            .catch((err) => {
                navigate("/err", {state: {errorMesssage: err}});
            })

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
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <div className="row">
                    <form
                        className="form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-item">
                            <InputLabel>Name:</InputLabel>
                            <TextField
                                sx={{ width: "300px" }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="small"
                            />
                        </div>
                        <div className="form-item">
                            <InputLabel>Description:</InputLabel>
                            <TextField
                                sx={{ width: "300px" }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                size="small"
                                multiline
                                rows={10}
                            />
                        </div>
                        <Button
                            className="form-item"
                            type="submit"
                            variant="contained"
                        >Submit</Button>
                    </form>
                    <div className="column" style={{justifyContent: "flex-start"}}>
                        <Button
                            onClick={(e) => navigate("/inviteorganization", {
                                state: {
                                    orgId: orgId
                                }
                            })}
                            variant="contained"
                            color="inherit"
                            sx={{ marginLeft: "10px" }}
                        >Invite</Button>
                    </div>
                </div>
                <div className="row">
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={(e) => navigate("/")}
                    >
                        Back
                    </Button>
                </div>
            </Box>
        </Grid>
    );
}

export default EditOrgPage;