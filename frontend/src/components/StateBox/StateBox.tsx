import { useMutation } from "@apollo/client";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiFillEdit } from "react-icons/ai";
import { FaX } from "react-icons/fa6";
import { ItemTypes } from "../../constants/constants";
import { CHANGE_STATE_ORDER, DELETE_TASK_STATE } from "../../queries/projectQueries";
import { IsOverInfo } from "../../types/drag-types";
import { TaskState } from "../../types/graphql-types";
import EditStateDialog from "../EditStateDialog/EditStateDialog";

type Props = {
    state: TaskState,
    loadTaskStates: () => void,
    isOverInfo: IsOverInfo | null,
    setIsOverInfo: React.Dispatch<React.SetStateAction<IsOverInfo | null>>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
    setIsChanging: React.Dispatch<React.SetStateAction<boolean>>,
}

const StateBox = ({ state, loadTaskStates, isOverInfo, setIsOverInfo, setIsDragging, setIsChanging }: Props) => {
    const ref = useRef(null);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.STATE,
        item: { id: state.id, order: state.order },
        collect: (monitor) => ({
            item: monitor.getItem(),
            isDragging: !!monitor.isDragging()
        })
    }), [state]);

    const [deleteTaskState, { loading: deleteStateLoading }] = useMutation(DELETE_TASK_STATE);
    const [changeOrder, { loading: orderLoading }] = useMutation(CHANGE_STATE_ORDER);
    const [stateId, setStateId] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.STATE,
        drop: (item) => {
            const obj = item as any;
            const fromId = obj.id;
            if (state.order != null) changeTaskStateOrder(fromId, state.order);
        },
        canDrop: (item: any) => {
            if (item.id) {
                return item.id != state.id
            } else {
                return false;
            }
        },
        hover: (item, monitor) => {
            let isOver: boolean = false;
            let higherOrder: boolean = false;
            if (state.order != null) {
                if (item.order > state.order) {
                    isOver = true;
                    higherOrder = true;
                } else if (item.order < state.order) {
                    isOver = true;
                }
            }
            setIsOverInfo({
                isOver: isOver,
                higherOrder: higherOrder
            })
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [state]);

    useEffect(() => {
        if (!isOver) setIsOverInfo({ isOver: false, higherOrder: false });
    }, [isOver])

    useEffect(() => {
        setIsChanging(orderLoading)
    }, [orderLoading])


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
    }, [ref])

    useEffect(() => {
        setIsDragging(isDragging);
    }, [isDragging])
    return (
        <div ref={ref} className="row">
            {((isOver || orderLoading) && isOverInfo?.higherOrder)
                && <div className="divider"></div>}
            <div className="box state-box">
                <div className="box-title">
                    <p style={{ boxSizing: "border-box" }}>{state.name}</p>
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
            </div>
            {((isOver || orderLoading) && !isOverInfo?.higherOrder)
                && <div className="divider"></div>}
            <EditStateDialog
                open={dialogOpen}
                handleClose={handleClose}
                loadTaskStates={loadTaskStates}
                stateId={stateId}
            />
        </div>
    );
}

export default StateBox;