import { ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client";
import { Box, Button, Dialog, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { UPDATE_TASK } from "../../queries/taskQueries";
import Spinner from "../Spinner/Spinner";

type Props = {
    task: any,
    open: boolean,
    handleClose: () => void,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>
}

const EditTaskDialog = ({ task, open, handleClose, refetch }: Props) => {
    const [name, setName] = useState(task.name || "");
    const [description, setDescription] = useState(task.description || "");
    const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const input = {
            id: parseInt(task.id),
            name: name,
            description: description
        }
        updateTask({
            variables: {
                input: input
            }
        }).then(() => {
            handleClose();
            refetch();
        });
    }

    useEffect(() => {
        setName(task.name);
        setDescription(task.description);
    }, [task])

    if (updateLoading) {
        return <Spinner />
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{
                margin: "auto"
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                flexWrap="nowrap"
                justifyContent="center"
                alignItems="center"
                component="form"
                sx={{ padding: "20px" }}
                onSubmit={handleSubmit}
            >
                <InputLabel>Name</InputLabel>
                <TextField
                    label="Name"
                    size="small"
                    sx={{ width: "400px" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputLabel>Description</InputLabel>
                <TextField
                    label="Description"
                    size="small"
                    sx={{ width: "400px" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={7}
                />
                <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="nowrap"
                    width="100%"
                    justifyContent="space-between"
                    marginTop="10px"
                >
                    <Button variant="contained" color="inherit" onClick={(e) => handleClose()}>Close</Button>
                    <Button type="submit" variant="contained">Submit</Button>
                </Box>
            </Box>
        </Dialog>
    );
}

export default EditTaskDialog;