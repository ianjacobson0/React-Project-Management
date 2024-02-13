import { useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import { CREATE_ORG } from "../../../queries/organizationQueries";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import Spinner from "../../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";

const CreateStage = (
    {
        setOrgId,
        setCurrentStage
    }:
        {
            setOrgId: React.Dispatch<React.SetStateAction<number>>,
            setCurrentStage: React.Dispatch<React.SetStateAction<number>>
        }) => {
    const navigate = useNavigate();
    const [createOrg, { loading }] = useMutation(CREATE_ORG);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const userId = sessionStorage.getItem("userId");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!userId) {
            navigate("/login");
        } else {
            const input = {
                ownerId: parseInt(userId),
                name: name,
                description: description
            }
            createOrg({ variables: { input } })
                .then(({ data }) => {
                    if (data.createOrganization) {
                        setOrgId(parseInt(data.createOrganization.id));
                        setCurrentStage(2);
                    }
                })
                .catch((err) => {
                    navigate("/error", { state: { errorMessage: err.message } });
                })

        }
    }

    return (
        <>
            {loading && <Spinner />}
            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxHeight="400px"
            >
                <Typography variant="h4" component="h4">Create an Organization</Typography>
                <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                    <InputLabel>Name:</InputLabel>
                    <TextField
                        required
                        label="name"
                        sx={{ height: "40px", width: "300px" }}
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                <Button type="submit" variant="contained">Create</Button>
            </Box >
        </>
    );
}

export default CreateStage;