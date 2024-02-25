import { useEffect, useRef, useState } from "react";
import { IsOverInfo } from "../../types/drag-types";
import { TaskState } from "../../types/graphql-types";
import StateBox from "../StateBox/StateBox";
import TaskList from "../TaskList/TaskList";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../constants/constants";
import { useApolloClient, useMutation } from "@apollo/client";
import { CHANGE_TASK_STATE } from "../../queries/taskQueries";


type Props = {
    stateObj: TaskState,
    loadTaskStates: () => void
}

const Column = ({ stateObj, loadTaskStates }: Props) => {
    const client = useApolloClient();
    const ref = useRef(null);
    const [isOverInfo_state, setIsOverInfo_state] = useState<IsOverInfo | null>(null);
    const [isDragging_state, setIsDragging_state] = useState(false);
    const [isOrderChanging, setIsOrderChanging] = useState(false);

    const [changeTaskState] = useMutation(CHANGE_TASK_STATE);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item) => {
            const obj = item as any;
            const fromId = parseInt(obj.id);
            changeTaskState({
                variables: {
                    input: {
                        id: fromId,
                        taskStateId: stateObj.id
                    }
                }
            }).then(() => {
                client.reFetchObservableQueries()
            });
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        }),
        canDrop: (item) => {
            const obj = item as any;
            const fromStateId = parseInt(obj.stateId);
            return fromStateId !== stateObj.id;
        }
    }), [stateObj]);

    useEffect(() => {
        drop(ref);
    }, []);

    return (
        <div
            ref={ref}
            className="column"
            style={{
                display: isDragging_state ? "none" : "flex",
                alignItems: isOverInfo_state?.isOver ?
                    isOverInfo_state?.higherOrder ? "flex-end" : "flex-start"
                    :
                    "center"
            }}
        >
            <div
                className="hover"
                style={{ display: isOver ? "block" : "none" }}
            ></div>
            <div
                className="highlight-left"
                style={{
                    display: ((isOrderChanging || isOverInfo_state?.isOver) && isOverInfo_state?.higherOrder)
                        ? "block" : "none"
                }}
            ></div>
            <StateBox
                state={stateObj}
                loadTaskStates={loadTaskStates}
                isOverInfo={isOverInfo_state}
                setIsOverInfo={setIsOverInfo_state}
                setIsDragging={setIsDragging_state}
                setIsChanging={setIsOrderChanging}
            />
            <TaskList stateId={stateObj.id} />
            <div
                className="highlight-right"
                style={{
                    display: ((isOrderChanging || isOverInfo_state?.isOver) && !isOverInfo_state?.higherOrder)
                        ? "block" : "none"
                }}
            ></div>
        </div >
    );
}

export default Column;