import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { CHECK_ORG_BY_USER_ID } from "../../../queries/organizationQueries";
import Spinner from "../../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { CREATE_PROJECT } from "../../../queries/projectQueries";

const CreateStage = ({
    setProjectId,
    setCurrentStage
}: {
    setProjectId: React.Dispatch<React.SetStateAction<number>>,
    setCurrentStage: React.Dispatch<React.SetStateAction<number>>
}) => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [orgId, setOrgId] = useState(0);
    const { data, loading, error } = useQuery(CHECK_ORG_BY_USER_ID, { variables: { id: parseInt(userId || "0") } });
    const [createProject, { loading: createLoading }] = useMutation(CREATE_PROJECT);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (userId) {
            const input = {
                orgId: orgId,
                userId: parseInt(userId),
                title: title,
                description: description
            }
            createProject({
                variables: {
                    input
                }
            })
                .then(({ data }) => {
                    if (data && data.createProject) {
                        setProjectId(parseInt(data.createProject.id));
                        setCurrentStage(2);
                    }
                })
                .catch((err) => navigate("/error", { state: { errorMessage: err.message } }));
        }
    }

    if (error) {
        navigate("/error", { state: { errorMessage: error.message } });
    }

    useEffect(() => {
        if (data && data.organizationByUserId) {
            setOrganizations(data.organizationByUserId);
        }
    }, [data])

    if (loading) {
        return <Spinner />
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            maxHeight="600px"
        >
            <Typography variant="h4" component="h4">Create a Project</Typography>
            <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                <InputLabel>Name:</InputLabel>
                <TextField
                    required
                    label="name"
                    sx={{ height: "40px", width: "300px" }}
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Box>
            <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                <InputLabel>Description:</InputLabel>
                <TextField
                    required
                    label="description"
                    sx={{ width: "300px" }}
                    size="small"
                    multiline
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>
            <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                <InputLabel>Organization:</InputLabel>
                <Select
                    required
                    value={orgId}
                    onChange={(e) => setOrgId(parseInt(e.target.value as any))}
                    sx={{ width: "300px" }}>
                    {organizations.map(o => {
                        return <MenuItem value={o.id as any}>{o.name}</MenuItem>
                    })}
                </Select>
            </Box>
            <Button type="submit" variant="contained">Create</Button>
        </Box>
    )
}

export default CreateStage;