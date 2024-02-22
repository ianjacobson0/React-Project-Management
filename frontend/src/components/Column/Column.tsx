import { useEffect, useState } from "react";
import { IsOverInfo } from "../../types/drag-types";
import { TaskState } from "../../types/graphql-types";
import StateBox from "../StateBox/StateBox";
import TaskList from "../TaskList/TaskList";


type Props = {
    stateObj: TaskState,
    loadTaskStates: () => void
}

const Column = ({ stateObj, loadTaskStates }: Props) => {
    const [isOverInfo_state, setIsOverInfo_state] = useState<IsOverInfo | null>(null);
    const [isDragging_state, setIsDragging_state] = useState(false);
    const [isOrderChanging, setIsOrderChanging] = useState(false);

    return (
        <div
            className="column"
            style={{
                display: isDragging_state ? "none" : "flex",
                alignItems: isOverInfo_state?.higherOrder ? "flex-end" : "flex-start"
            }}
        >
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
            ></div >
        </div >
    );
}

export default Column;