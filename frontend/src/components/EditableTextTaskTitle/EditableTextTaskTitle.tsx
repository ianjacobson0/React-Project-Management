import { ApolloCache, ApolloQueryResult, DefaultContext, MutationOptions, OperationVariables, useMutation } from "@apollo/client";
import { Operation } from "apollo-link";
import { useEffect, useState } from "react";
import { UPDATE_TASK } from "../../queries/taskQueries";
import { Task, TaskState } from "../../types/graphql-types";

type Props = {
    task: Task,
    setOverInput: React.Dispatch<React.SetStateAction<boolean>>,
    refetch: (variables?: Partial<Operation> | undefined) => Promise<ApolloQueryResult<any>>
}

const EditableTextTaskTitle = ({ task, setOverInput, refetch }: Props) => {
    const [updateTask, { loading }] = useMutation(UPDATE_TASK);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(task.name);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    }

    const handleBlur = () => {
        updateTask({
            variables: {
                input: {
                    id: task.id,
                    name: value,
                    description: task.description
                }
            }
        }).then(() => {
            setIsEditing(false);
            refetch();
        });
    }

    useEffect(() => {
        setValue(task.name);
    }, [task])

    return (
        <div
            onClick={handleClick}
            className="editable-text"
            onMouseEnter={(e) => setOverInput(true)}
            onMouseLeave={(e) => setOverInput(false)}
        >
            <input
                autoFocus={false}
                readOnly={!isEditing}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
            />
        </div>
    );
}

export default EditableTextTaskTitle;