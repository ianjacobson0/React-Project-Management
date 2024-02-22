import { TaskState } from "../../types/graphql-types";
import Column from "../Column/Column";
import ColumnAdd from "../ColumnAdd/ColumnAdd";
import StateBox from "../StateBox/StateBox";
import TaskList from "../TaskList/TaskList";

type Props = {
    projectId: number,
    taskStates: TaskState[],
    loadTaskStates: () => void,
    createState: () => void
}

const MainBoard = ({ projectId, taskStates, loadTaskStates, createState }: Props) => {
    return (
        <div className="board">

            {taskStates.map((state) => {
                return (
                    <Column
                        stateObj={state}
                        loadTaskStates={loadTaskStates}
                        key={`${state.id}`}
                    />
                );
            })}
            {projectId !== 0 && <ColumnAdd createState={createState} />}
        </div >
    );
}

export default MainBoard;