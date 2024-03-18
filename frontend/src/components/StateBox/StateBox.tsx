import { useMutation } from "@apollo/client";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiFillEdit } from "react-icons/ai";
import { FaX } from "react-icons/fa6";
import { ItemTypes } from "../../constants/constants";
import { CHANGE_STATE_ORDER, DELETE_TASK_STATE, UPDATE_TASK_STATE } from "../../queries/projectQueries";
import { IsOverInfo } from "../../types/drag-types";
import { TaskState } from "../../types/graphql-types";
import EditStateDialog from "../EditStateDialog/EditStateDialog";
import ContextMenuContainer from "../ContextMenuContainer/ContextMenuContainer";
import { ContextMenuFunctionMap, ContextMenuItem } from "../../types/context-menu-types";
import EditableTextBox from "../EditableTextBox/EditableTextBox";

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

    const [deleteTaskState, { loading: deleteStateLoading }] = useMutation(DELETE_TASK_STATE);
    const [changeOrder, { loading: orderLoading }] = useMutation(CHANGE_STATE_ORDER);
    const [updateState, { loading: updateLoading }] = useMutation(UPDATE_TASK_STATE);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.STATE,
        item: { id: state.id, order: state.order },
        collect: (monitor) => ({
            item: monitor.getItem(),
            isDragging: !!monitor.isDragging()
        }),
        canDrag: () => !isEditing
    }), [state]);

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

    const editState_click = () => {
        setDialogOpen(true);
    }

    const changeStateName = (name: string) => {
        updateState({
            variables: {
                input: {
                    id: state.id,
                    name: name,
                    complete: state.complete
                }
            }
        }).then(() => loadTaskStates());
    }

    const deleteState_click = () => {
        deleteTaskState({ variables: { id: state.id } })
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


    const mapFunctions: ContextMenuFunctionMap[] = [
        {
            id: 1,
            action: editState_click
        },
        {
            id: 2,
            action: deleteState_click
        }
    ];

    const mapItems: ContextMenuItem[] = [
        {
            id: 1,
            title: "Edit"
        },
        {
            id: 2,
            title: "Delete"
        }
    ]

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
            <ContextMenuContainer
                items={mapItems}
                functionMap={mapFunctions}
                type="statebox"
                id={state.id}
            >
                <div className="box state-box">
                    <div className="box-title">
                        <EditableTextBox
                            defaultValue={state.name ?? ""}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            update={changeStateName}
                        />
                        <div className="row">
                            <AiFillEdit
                                className="box-text"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => editState_click()}
                            />
                            <FaX
                                className="red"
                                style={{ cursor: "pointer" }}
                                size={13}
                                color="red"
                                onClick={(e) => deleteState_click()}
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
            </ContextMenuContainer>
            {((isOver || orderLoading) && !isOverInfo?.higherOrder)
                && <div className="divider"></div>}
            <EditStateDialog
                open={dialogOpen}
                handleClose={handleClose}
                loadTaskStates={loadTaskStates}
                stateId={state.id}
            />
        </div>
    );
}

export default StateBox;