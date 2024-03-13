import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { DELETE_PROJECT, QUERY_PROJECT, UPDATE_PROJECT } from "../../queries/projectQueries";
import Spinner from "../../components/Spinner/Spinner";
import { CHECK_ORG_BY_USER_ID } from "../../queries/organizationQueries";
const EditProjectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const projectId = parseInt(location.state?.projectId || "0");
    const userId = parseInt(sessionStorage.getItem("userId") || "0");
    const { data, loading, error } = useQuery(QUERY_PROJECT, {
        variables: {
            id: projectId
        },
        fetchPolicy: "network-only"
    });
    const { data: orgData, loading: orgLoading, error: errorOrg } = useQuery(CHECK_ORG_BY_USER_ID, {
        variables: {
            id: userId
        }
    });
    const [deleteProject, { loading: deleteLoading }] = useMutation(DELETE_PROJECT);
    const [updateProject, { loading: updateLoading }] = useMutation(UPDATE_PROJECT);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [orgId, setOrgId] = useState(0);

    useEffect(() => {
        if (projectId == 0) {
            navigate("/");
        }
    }, [projectId])

    useEffect(() => {
        if (data && data.project) {
            setTitle(data.project.title);
            setDescription(data.project.description);
            setOrgId(data.project.orgId);
        }
    }, [data])

    const update_click = (e: FormEvent) => {
        e.preventDefault();
        const input = {
            id: projectId,
            title: title,
            description: description,
            orgId: orgId
        }
        updateProject({
            variables: {
                input: input
            }
        })
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                navigate("/error", { state: { errorMessage: error.message } });
            })

    }

    if (loading || orgLoading || updateLoading) {
        return <Spinner />
    }

    if (error) {
        navigate("/error", { state: { errorMessage: error.message } });
    }

    if (errorOrg) {
        navigate("/error", { state: { errorMessage: errorOrg.message } });
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
                onSubmit={update_click}
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <InputLabel>Title:</InputLabel>
                <TextField
                    required
                    size="small"
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ width: "400px", marginTop: "10px" }}
                />
                <InputLabel>Description:</InputLabel>
                <TextField
                    required
                    size="small"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={7}
                    sx={{ width: "400px", overflowY: "scroll", marginTop: "10px" }}
                />
                <InputLabel>Description:</InputLabel>
                <Select
                    value={orgId}
                    onChange={(e) => setOrgId(parseInt(e.target.value.toString()))}
                    sx={{ width: "400px", marginTop: "10px" }}
                >
                    {orgData?.organizationByUserId && orgData.organizationByUserId.map((o: any) => {
                        return (<MenuItem value={o.id as any}>{o.name}</MenuItem>)
                    })}
                </Select>
                <div className="row" style={{ marginTop: "10px" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ display: "block", margin: "auto" }}
                    >
                        Submit
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={() => {
                            deleteProject({
                                variables: {
                                    id: projectId
                                }
                            }).then(() => {
                                sessionStorage.removeItem("projectId");
                                navigate("/");
                            })
                        }}
                    >Delete</Button>
                </div>
            </Box>
        </Grid >);
}

export default EditProjectPage;