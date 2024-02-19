import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { FaX } from "react-icons/fa6";
import { CHANGE_STATE_ORDER, DELETE_TASK_STATE } from "../../../queries/projectQueries";
import { useEffect, useRef, useState } from "react";
import EditStateDialog from "./EditStateDialog";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../../constants/constants";

const TaskState = ({ o, loadTaskStates }: { o: any, loadTaskStates: () => void }) => {
    const ref = useRef();
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.STATE,
        item: { id: parseInt(o.id) },
        collect: (monitor) => ({
            item: monitor.getItem(),
            isDragging: !!monitor.isDragging()
        })
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.STATE,
        drop: (item) => {
            const obj = item as any;
            const fromId = obj.id;
            console.log(o.name, o.order);
            changeTaskStateOrder(fromId, parseInt(o.order));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [o]);

    const [deleteTaskState, { loading: deleteStateLoading }] = useMutation(DELETE_TASK_STATE);
    const [changeOrder, { loading: orderLoading }] = useMutation(CHANGE_STATE_ORDER);
    const [stateId, setStateId] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClose = () => {
        setDialogOpen(false);
    }

    const editState_click = (id: number) => {
        setStateId(id);
        setDialogOpen(true);
    }

    const deleteState_click = (id: number) => {
        deleteTaskState({ variables: { id: id } })
            .then(({ data }) => {
                loadTaskStates();
            })
    }

    const changeTaskStateOrder = (id: number, newOrder: number) => {
        changeOrder({
            variables: {
                input: {
                    id: id,
                    newOrder: newOrder
                }
            }
        }).then(() => {
            loadTaskStates();
        })
    }

    useEffect(() => {
        drag(drop(ref));
    }, [])

    return (
        <>
            <Box
                ref={ref}
                display="flex"
                flexDirection="row"
                flexWrap="nowrap"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    backgroundColor: "#efefef",
                    height: "150x",
                    width: "200px",
                    padding: "5px",
                    boxSizing: "border-box",
                    borderRadius: "0",
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
                }}
                position="relative"
            >
                <Typography variant="body2" sx={{ boxSizing: "border-box", height: "1rem" }}><b>{o.name}</b></Typography>
                <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="nowrap"
                    alignItems="center"
                    justifyContent="center"
                >
                    <AiFillEdit
                        style={{ cursor: "pointer" }}
                        onClick={(e) => editState_click(parseInt(o.id))}
                    />
                    <FaX
                        style={{ cursor: "pointer" }}
                        size={15}
                        color="red"
                        onClick={(e) => deleteState_click(parseInt(o.id))}
                    />
                </Box>
                {o.complete &&
                    <Box
                        sx={{
                            position: "absolute",
                            backgroundColor: "limegreen",
                            width: "5px",
                            height: "100%",
                            right: "0"
                        }}
                    >
                    </Box>}
            </Box>
            <EditStateDialog
                open={dialogOpen}
                handleClose={handleClose}
                loadTaskStates={loadTaskStates}
                stateId={stateId}
            />
        </>
    );
}

export default TaskState;