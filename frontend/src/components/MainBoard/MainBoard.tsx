import { TaskState } from "../../types/graphql-types";
import Column from "../Column/Column";
import ColumnAdd from "../ColumnAdd/ColumnAdd";
import StateBox from "../StateBox/StateBox";
import TaskList from "../TaskList/TaskList";

type Props = {
    projectId: number,
    taskStates: TaskState[],
    loadTaskStates: () => void,
    createState: () => void,
    isLoading: boolean,
}

const MainBoard = ({ projectId, taskStates, loadTaskStates, createState, isLoading }: Props) => {
    return (
        <div className="board">

            {!isLoading && taskStates.map((state, idx) => {
                return (
                    <Column
                        stateObj={state}
                        loadTaskStates={loadTaskStates}
                        key={`${state.id}-${idx}-${(new Date())}`}
                    />
                );
            })}
            {!isLoading && projectId !== 0 && <ColumnAdd createState={createState} />}
        </div >
    );
}

export default MainBoard;