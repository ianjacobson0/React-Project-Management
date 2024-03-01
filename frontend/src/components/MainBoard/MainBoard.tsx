import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TaskState } from "../../types/graphql-types";
import Column from "../Column/Column";
import ColumnAdd from "../ColumnAdd/ColumnAdd";

type Props = {
    projectId: number | null,
    taskStates: TaskState[],
    loadTaskStates: () => void,
    createState: () => void,
    isLoading: boolean,
    isNoProjects: boolean,
    projectName: string | undefined,
    orgName: string | undefined
}

export const ContextMenuContext = React.createContext({
    open: (id: string) => { },
    close: () => { },
    currentId: ""
});

const MainBoard = ({
    projectId,
    taskStates,
    loadTaskStates,
    createState,
    isLoading,
    isNoProjects,
    projectName,
    orgName
}: Props) => {
    const navigate = useNavigate();
    const [openContextMenuId, setOpenContextMenuId] = useState("");

    const openContextMenu = (id: string) => {
        setOpenContextMenuId(id);
    }

    const closeContextMenu = () => {
        setOpenContextMenuId("");
    }

    const states = React.useMemo(() => {
        return taskStates.map((state, idx) => {
            return (
                <Column
                    stateObj={state}
                    loadTaskStates={loadTaskStates}
                    key={`${state.id}-${idx}-${(new Date())}`}
                />
            );
        });
    }, [taskStates])

    return (
        <div className="board">
            {orgName && projectName &&
                <div className="header">
                    <div className="org-name">{orgName}</div>
                    <div className="project-name">{projectName}</div>
                </div>
            }
            <div className="columns-container" onScroll={() => openContextMenu("scroll")}>
                <ContextMenuContext.Provider value={{
                    open: openContextMenu,
                    close: closeContextMenu,
                    currentId: openContextMenuId
                }}>
                    {!isNoProjects && !isLoading && states}
                </ContextMenuContext.Provider>
                {!isNoProjects && !isLoading && projectId !== 0 && <ColumnAdd createState={createState} />}
                {!isLoading && isNoProjects &&
                    <div className="main-board-message">
                        <div><i>You currently have no active projects</i></div>
                        <Button
                            variant="contained"
                            onClick={(e) => navigate("/createproject")}>
                            Create a Project?
                        </Button>
                    </div>
                }
            </div>
        </div >
    );
}

export default MainBoard;