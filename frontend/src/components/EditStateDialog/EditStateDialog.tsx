import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Button, Dialog, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { QUERY_STATE_BY_ID, UPDATE_TASK_STATE } from "../../queries/projectQueries";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const EditStateDialog = ({ open, handleClose, loadTaskStates, stateId }: { open: boolean, handleClose: () => void, loadTaskStates: () => void, stateId: number }) => {
    const navigate = useNavigate();
    const [queryTaskStateById, { loading: queryStateLoading }] = useLazyQuery(QUERY_STATE_BY_ID, { fetchPolicy: "network-only" });
    const [updateTaskState, { loading: updateStateLoading }] = useMutation(UPDATE_TASK_STATE);
    const [stateName, setStateName] = useState("");
    const [stateComplete, setStateComplete] = useState(false);

    useEffect(() => {
        queryTaskStateById({ variables: { id: stateId } })
            .then(({ data }) => {
                if (data.taskState) {
                    setStateName(data.taskState.name);
                    setStateComplete(data.taskState.complete);
                }
            })
    }, [stateId])

    const handleSubmitState = (e: FormEvent) => {
        e.preventDefault();
        updateTaskState({
            variables: {
                input: {
                    id: stateId,
                    name: stateName,
                    complete: stateComplete
                }
            }
        })
            .then(() => {
                loadTaskStates();
                handleClose();
            })
            .catch((err) => {
                navigate("/error", { state: { errorMessage: err.message } });
            })
    }

    if (queryStateLoading || updateStateLoading) {
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
            <Box component="form" sx={{ padding: "20px" }} onSubmit={handleSubmitState}>
                <InputLabel>Name</InputLabel>
                <TextField
                    label="Name"
                    size="small"
                    sx={{ width: "200px" }}
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                />
                <InputLabel>Complete</InputLabel>
                <Select
                    sx={{ width: "200px" }}
                    value={stateComplete}
                    onChange={(e) => setStateComplete(e.target.value as any)}
                >
                    <MenuItem value={true as any}>True</MenuItem>
                    <MenuItem value={false as any}>False</MenuItem>
                </Select>
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </Dialog>
    );
}

export default EditStateDialog;