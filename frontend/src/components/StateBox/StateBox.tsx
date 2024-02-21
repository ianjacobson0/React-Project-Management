import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Collapse, Typography } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { FaX } from "react-icons/fa6";
import { CHANGE_STATE_ORDER, DELETE_TASK_STATE } from "../../queries/projectQueries";
import { useEffect, useRef, useState } from "react";
import EditStateDialog from "../EditStateDialog/EditStateDialog";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../constants/constants";
import { TaskState } from "../../types/graphql-types";

type Props = {
    state: TaskState,
    loadTaskStates: () => void,
    setIsOver: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
}

const StateBox = ({ state, loadTaskStates, setIsOver, setIsDragging }: Props) => {
    const ref = useRef(null);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.STATE,
        item: { id: state.id },
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
            setIsOrderChanging(true);
            if (state.order != null) changeTaskStateOrder(fromId, state.order);
        },
        canDrop: (item: any) => {
            if (item.id) {
                return item.id != state.id
            } else {
                return false;
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [state]);

    const [deleteTaskState, { loading: deleteStateLoading }] = useMutation(DELETE_TASK_STATE);
    const [changeOrder, { loading: orderLoading }] = useMutation(CHANGE_STATE_ORDER);
    const [stateId, setStateId] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isOrderChanging, setIsOrderChanging] = useState(false);

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
            setIsOrderChanging(false);
        })
    }

    useEffect(() => {
        drag(drop(ref));
    }, [ref])

    useEffect(() => {
        setIsOver(isOver);
    }, [isOver])

    useEffect(() => {
        setIsDragging(isDragging);
    }, [isDragging])

    return (
        <div ref={ref} className="row">
            {(isOver || isOrderChanging) && <div className="divider"></div>}
            <div className="box state-box">
                <Typography variant="body2" sx={{ boxSizing: "border-box", height: "1rem" }}><b>{state.name}</b></Typography>
                <div className="row">
                    <AiFillEdit
                        className="box-text"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => editState_click(state.id)}
                    />
                    <FaX
                        className="red"
                        style={{ cursor: "pointer" }}
                        size={13}
                        color="red"
                        onClick={(e) => deleteState_click(state.id)}
                    />
                </div>
                {state.complete &&
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
            </div>
            <EditStateDialog
                open={dialogOpen}
                handleClose={handleClose}
                loadTaskStates={loadTaskStates}
                stateId={stateId}
            />
        </div >
    );
}

export default StateBox;