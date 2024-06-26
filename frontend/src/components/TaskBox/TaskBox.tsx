import { ApolloQueryResult, OperationVariables, useApolloClient, useMutation } from "@apollo/client";
import { useContext, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiFillEdit } from "react-icons/ai";
import { FaEye, FaX } from "react-icons/fa6";
import { RxCaretDown } from "react-icons/rx";
import { ItemTypes } from "../../constants/constants";
import { CHANGE_TASK_ORDER, CHANGE_TASK_STATE, DELETE_TASK, UPDATE_TASK } from "../../queries/taskQueries";
import EditTaskDialog from "../EditTaskDialog/EditTaskDialog";
import EditableTextTaskTitle from "../EditableTextTaskTitle/EditableTextTaskTitle";
import ViewTaskDialog from "../ViewTaskDialog/ViewTaskDialog";
import ContextMenuContainer from "../ContextMenuContainer/ContextMenuContainer";
import { ContextMenuFunctionMap, ContextMenuItem } from "../../types/context-menu-types";
import EditableTextBox from "../EditableTextBox/EditableTextBox";

type Props = {
    task: any,
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>
}

const TaskBox = ({ task, refetch }: Props) => {
    const client = useApolloClient();
    const ref = useRef<HTMLDivElement>(null);
    const [deleteTask, { loading: deleteLoading }] = useMutation(DELETE_TASK);
    const [changeTaskOrder, { loading: orderLoading }] = useMutation(CHANGE_TASK_ORDER);
    const [changeTaskState, { loading: changeStateLoading }] = useMutation(CHANGE_TASK_STATE);
    const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK);

    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: parseInt(task.id), stateId: parseInt(task.taskStateId) },
        collect: (monitor) => ({
            item: monitor.getItem(),
            isDragging: !!monitor.isDragging()
        }),
        canDrag: (monitor) => {
            return !isEditing;
        }
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
        }),
        canDrop: (item) => {
            const obj = item as any;
            const stateId = parseInt(obj.stateId);
            return stateId === parseInt(task.taskStateId);
        }
    }), [task]);

    useEffect(() => {
        if (ref.current) {
            ref.current.setAttribute('draggable', (!isEditing).toString());
        }
    }, [isEditing])

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
                refetch();
            });
    }

    const delete_click = () => {
        deleteTask({
            variables: {
                id: parseInt(task.id)
            }
        }).then(() => refetch());
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

    const toggleDesription = () => {
        setDescriptionOpen(!descriptionOpen);
        setTimeout(() => {
            setShowContent(!showContent);
        }, descriptionOpen ? 0 : 100);
    }

    const handleEditClose = () => {
        setEditOpen(false);
    }

    const handleViewClose = () => {
        setViewOpen(false);
    }

    const changeTaskName = (name: string) => {
        updateTask({
            variables: {
                input: {
                    id: parseInt(task.id),
                    name: name,
                    description: task.description ?? ""
                }
            }
        }).then(() => refetch());
    }

    const taskMenuData: ContextMenuItem[] = [
        {
            id: 1,
            title: "Edit"
        },
        {
            id: 2,
            title: "Delete"
        },
    ]


    const contextMenuFunctions: ContextMenuFunctionMap[] = [
        {
            id: 1,
            action: () => setEditOpen(true)
        },
        {
            id: 2,
            action: delete_click
        }
    ];

    return (
        <ContextMenuContainer
            items={taskMenuData}
            functionMap={contextMenuFunctions}
            type="task"
            id={parseInt(task.id)}
        >
            <div
                className="box task-box"
                style={{
                    height: descriptionOpen ? "200px" : "25px"
                }}
                ref={ref}
                onContextMenu={(e) => {
                    e.preventDefault();
                }}
            >
                <div className="box-title" onClick={(e) => toggleDesription()}>
                    <EditableTextBox
                        defaultValue={task.name ?? ""}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        update={changeTaskName}
                    />
                    <RxCaretDown
                        size={15}
                        className="box-text"
                        style={{ cursor: "pointer" }}
                    />

                </div>
                <div
                    className="box-description"
                    style={{
                        height: descriptionOpen ? "200px" : "0px"
                    }}
                >
                    <div className="box-content"
                        style={{ opacity: showContent ? "1.0" : "0.0" }}
                    >
                        <div className="text-box description-text">
                            {(task.description !== "" && task.description)
                                ? task.description : <i>no description</i>}
                        </div>
                        <div className="box-actions">
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
                        </div>
                    </div>
                </div>
                <EditTaskDialog open={editOpen} task={task} handleClose={handleEditClose} refetch={refetch} />
                <ViewTaskDialog open={viewOpen} task={task} handleClose={handleViewClose} />
            </div>
        </ContextMenuContainer>
    );
}

export default TaskBox;