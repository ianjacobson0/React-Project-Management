import { ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client";
import { Box, Button, Dialog, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { UPDATE_TASK } from "../../queries/taskQueries";
import Spinner from "../Spinner/Spinner";
import { Task } from "../../types/graphql-types";

type Props = {
    task: any,
    open: boolean,
    handleClose: () => void
}

const ViewTaskDialog = ({ task, open, handleClose }: Props) => {
    const [currentTask, setCurrentTask] = useState<Task>(task);

    useEffect(() => {
        setCurrentTask(task);
    }, [task])

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
                justifyContent="start"
                alignItems="start"
                padding="20px"
            >
                <Typography variant="body2">Name:</Typography>
                <Typography variant="subtitle1">{currentTask.name || <i>{"unnamed task"}</i>}</Typography>
                <Typography variant="body2">Description:</Typography>
                <Box
                    width="400px"
                    height="300px"
                    border="1px solid grey"
                    padding="10px"
                    sx={{ overflowY: "scroll" }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ whiteSpace: "pre-wrap" }}
                        margin="auto"
                        fontSize="small"
                    >
                        {currentTask.description || <i>no description</i>}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="inherit"
                    onClick={(e) => handleClose()}
                    sx={{ marginTop: "10px" }}
                >Close</Button>
            </Box>
        </Dialog >
    );
}

export default ViewTaskDialog;