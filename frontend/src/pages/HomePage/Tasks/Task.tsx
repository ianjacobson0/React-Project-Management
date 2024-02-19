import { ApolloQueryResult, OperationVariables, useApolloClient, useMutation } from "@apollo/client";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CHANGE_TASK_ORDER, CHANGE_TASK_STATE, DELETE_TASK } from "../../../queries/taskQueries";
import { FaEye, FaX } from "react-icons/fa6";
import Spinner from "../../../components/Spinner/Spinner";
import EditTaskDialog from "./EditTaskDialog";
import { AiFillEdit } from "react-icons/ai";
import ViewTaskDialog from "./ViewTaskDialog";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../../constants/constants";

type Props = {
    task: any,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>
}

const Task = ({ task, refetch }: Props) => {
    const client = useApolloClient();
    const ref = useRef();
    const [deleteTask, { loading: deleteLoading }] = useMutation(DELETE_TASK);
    const [changeTaskOrder, { loading: orderLoading }] = useMutation(CHANGE_TASK_ORDER);
    const [changeTaskState, { loading: changeStateLoading }] = useMutation(CHANGE_TASK_STATE);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: parseInt(task.id), stateId: parseInt(task.taskStateId) },
        collect: (monitor) => ({
            item: monitor.getItem(),
            isDragging: !!monitor.isDragging()
        })
    }), [task]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item) => {
            const obj = item as any;
            const fromId = obj.id;
            if (parseInt(task.taskStateId) === obj.stateId) {
                changeOrder(fromId, parseInt(task.order));
            } else {
                changeState(fromId, parseInt(task.taskStateId));
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [task]);

    useEffect(() => {
        drag(drop(ref));
    }, []);

    const changeOrder = (fromId: number, newOrder: number) => {
        changeTaskOrder({
            variables: {
                input: {
                    id: fromId,
                    newOrder: newOrder
                }
            }
        })
            .then(() => {
                console.log("done change task order");
                refetch();
            });
    }

    const changeState = (fromId: number, stateId: number) => {
        changeTaskState({
            variables: {
                input: {
                    id: fromId,
                    taskStateId: stateId
                }
            }
        }).then(() => client.reFetchObservableQueries());
    }

    const handleEditClose = () => {
        setEditOpen(false);
    }

    const handleViewClose = () => {
        setViewOpen(false);
    }

    const delete_click = () => {
        deleteTask({
            variables: {
                id: parseInt(task.id)
            }
        }).then(() => refetch());
    }

    return (
        <Box
            ref={ref}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="nowrap"
            marginTop="10px"
            sx={{
                backgroundColor: "#fcfcfc",
                height: "150x",
                width: "200px",
                padding: "5px",
                boxSizing: "border-box",
                borderRadius: "0",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
            }}
        >
            <Typography variant="body2" sx={{ height: "1rem" }}>{task?.name}</Typography>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                flexWrap="nowrap"
            >
                <FaEye
                    style={{ cursor: "pointer" }}
                    onClick={(e) => setViewOpen(true)}
                />
                <AiFillEdit
                    style={{ cursor: "pointer" }}
                    onClick={(e) => setEditOpen(true)}
                />
                <FaX
                    style={{ cursor: "pointer" }}
                    size={15}
                    color="red"
                    onClick={(e) => delete_click()}
                />
            </Box>
            <EditTaskDialog open={editOpen} task={task} handleClose={handleEditClose} refetch={refetch} />
            <ViewTaskDialog open={viewOpen} task={task} handleClose={handleViewClose} />
        </Box >
    );
}

export default Task;