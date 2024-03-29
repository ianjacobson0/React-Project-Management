import { ApolloCache, ApolloQueryResult, DefaultContext, MutationOptions, OperationVariables, useMutation } from "@apollo/client";
import { Operation } from "apollo-link";
import { useEffect, useRef, useState } from "react";
import { UPDATE_TASK } from "../../queries/taskQueries";
import { Task, TaskState } from "../../types/graphql-types";

type Props = {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    isEditing: boolean,
    update: (input: string) => void,
    defaultValue: string
}

const EditableTextBox = ({ isEditing, setIsEditing, update, defaultValue }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(defaultValue);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    }

    const handleBlur = () => {
        update(value);
        setIsEditing(false);
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            inputRef.current?.blur();
        }
    }

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue])

    return (
        <div
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            className="editable-text"
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

export default EditableTextBox;