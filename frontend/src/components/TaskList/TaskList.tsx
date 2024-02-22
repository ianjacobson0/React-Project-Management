import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { CREATE_TASK, QUERY_TASKS } from "../../queries/taskQueries";
import Spinner from "../Spinner/Spinner";
import { FaPlus } from "react-icons/fa6";
import { Box } from "@mui/material";
import TaskBox from "../TaskBox/TaskBox";

type Props = {
    stateId: number
}

const TaskList = ({ stateId }: Props) => {
    const { data, loading, refetch } = useQuery(QUERY_TASKS, {
        variables: {
            stateId: stateId
        },
        fetchPolicy: "network-only"
    });
    const [createTask, { loading: createLoading }] = useMutation(CREATE_TASK);

    const create_click = () => {
        createTask({
            variables: {
                input: {
                    taskStateId: stateId
                }
            }
        }).then(() => refetch())
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            {data.tasks.map((o: any, idx: number) => {
                return (<TaskBox task={o} refetch={refetch} key={`${o.taskStateId}-${o.id}}`} />);
            })}
            {!loading &&
                <div className="box task-box add-box" onClick={(e) => create_click()}>
                    <FaPlus size={15} className="box-text" />
                </div>
            }
        </>
    );
}

export default TaskList;