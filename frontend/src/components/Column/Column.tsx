import React, { useState } from "react";
import { TaskState } from "../../types/graphql-types";
import StateBox from "../StateBox/StateBox";
import TaskList from "../TaskList/TaskList";


type Props = {
    stateObj: TaskState,
    loadTaskStates: () => void
}

const Column = ({ stateObj, loadTaskStates }: Props) => {
    const [isOver_state, setIsOver_state] = useState(false);
    const [isDragging_state, setIsDragging_state] = useState(false);

    return (
        <div
            className="column"
            style={{ display: isDragging_state ? "none" : "flex" }}
        >
            <div
                className="highlight"
                style={{ display: isOver_state ? "block" : "none" }}
            ></div>
            <StateBox
                state={stateObj}
                loadTaskStates={loadTaskStates}
                setIsOver={setIsOver_state}
                setIsDragging={setIsDragging_state}
            />
            <TaskList stateId={stateObj.id} />
        </div>
    );
}

export default Column;