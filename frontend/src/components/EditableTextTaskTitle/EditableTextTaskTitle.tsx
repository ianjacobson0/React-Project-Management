import { ApolloCache, ApolloQueryResult, DefaultContext, MutationOptions, OperationVariables, useMutation } from "@apollo/client";
import { Operation } from "apollo-link";
import { useEffect, useRef, useState } from "react";
import { UPDATE_TASK } from "../../queries/taskQueries";
import { Task, TaskState } from "../../types/graphql-types";

type Props = {
    task: Task,
    setOverInput: React.Dispatch<React.SetStateAction<boolean>>,
    refetch: (variables?: Partial<Operation> | undefined) => Promise<ApolloQueryResult<any>>,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    isEditing: boolean
}

const EditableTextTaskTitle = ({ task, setOverInput, refetch, isEditing, setIsEditing }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [updateTask, { loading }] = useMutation(UPDATE_TASK);
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

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            inputRef.current?.blur();
        }
    }

    useEffect(() => {
        setValue(task.name);
    }, [task])

    return (
        <div
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            className="editable-text"
            onMouseEnter={(e) => setOverInput(true)}
            onMouseLeave={(e) => setOverInput(false)}
        >
            <input
                ref={inputRef}
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