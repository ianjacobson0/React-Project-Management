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
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="nowrap"
                    marginTop="10px"
                    sx={{
                        backgroundColor: "#fcfcfc",
                        height: "150x",
                        width: "200px",
                        padding: "5px",
                        boxSizing: "border-box",
                        borderRadius: "0",
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        cursor: "pointer"
                    }}
                    onClick={(e) => create_click()}
                >
                    <FaPlus size={15} />
                </Box >
            }
        </>
    );
}

export default TaskList;