import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { CHECK_ORG_BY_USER_ID } from "../../queries/organizationQueries";
import { CHECK_PROJ_BY_USER_ID, CREATE_TASK_STATE, PROJECT_BY_ORG_USER_ID, QUERY_TASK_STATES } from "../../queries/projectQueries";
import { Organization, Project, TaskState } from "../../types/graphql-types";
import Column from "../../components/Column/Column";
import Tasks from "../../components/TaskList/TaskList";
import MainBoard from "../../components/MainBoard/MainBoard";

const HomePage = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");

    if (!userId) navigate("/login")

    const { data: orgData, loading, error } = useQuery(CHECK_ORG_BY_USER_ID, {
        variables: { id: parseInt(userId || "0") },
        fetchPolicy: "network-only"
    });
    const { data: projectData, loading: projectLoading } = useQuery(CHECK_PROJ_BY_USER_ID, {
        variables: { id: parseInt(userId || "0") },
        fetchPolicy: "network-only"
    });
    const [queryTaskStates, { loading: statesLoading }] = useLazyQuery(QUERY_TASK_STATES, {
        fetchPolicy: "network-only"
    });
    const [queryProjectsByOrgId, { loading: projectByOrgLoading }] = useLazyQuery(PROJECT_BY_ORG_USER_ID, {
        fetchPolicy: "network-only"
    });
    const [createTaskState, { loading: createStateLoading }] = useMutation(CREATE_TASK_STATE);

    const [orgId, setOrgId] = useState(0);
    const [projectId, setProjectId] = useState(0);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [taskStates, setTaskStates] = useState<TaskState[]>([]);

    const changeOrg = (id: number) => {
        setOrgId(id);
        sessionStorage.setItem("orgId", id.toString());
    }

    const changeProject = (id: number) => {
        console.log(typeof (id));
        setProjectId(id);
        setTaskStates([]);
        sessionStorage.setItem("projectId", id.toString());
    }

    const loadProjects = () => {
        if (orgId != 0) {
            queryProjectsByOrgId({
                variables: {
                    userId: parseInt(userId || "0"),
                    orgId: orgId
                }
            })
                .then(({ data }) => {
                    if (data && data.projectsByOrgIdAndUserId) {
                        setProjects(data.projectsByOrgIdAndUserId);
                        setProjectId(parseInt(sessionStorage.getItem("projectId") || "0"));
                    }
                })
                .catch((err) => {
                    navigate("/error", { state: { errorMessage: error?.message } });
                })
        }
    }

    const loadTaskStates = () => {
        if (projectId != 0) {
            queryTaskStates({
                variables: {
                    projectId: projectId
                }
            })
                .then(({ data }) => {
                    if (data.taskStates) {
                        setTaskStates(data.taskStates);
                    }
                })
                .catch((err) => {
                    navigate("/error", { state: { errorMessage: err.message } });
                })
        }
    }

    const createState = () => {
        createTaskState({
            variables: {
                input: {
                    projectId: projectId,
                    name: "",
                    complete: false
                }
            }
        })
            .then(({ data }) => {
                queryTaskStates({
                    variables: {
                        projectId: projectId
                    }
                })
                    .then(({ data }) => {
                        if (data.taskStates) {
                            setTaskStates(data.taskStates);
                        }
                    })
                    .catch((err) => {
                        navigate("/error", { state: { errorMessage: err.message } });
                    })
            })
            .catch((err) => {
                navigate("/error", { state: { errorMessage: err.message } });
            })
    }

    useEffect(() => {
        const orgId = parseInt(sessionStorage.getItem("orgId") || "0")
        setOrgId(orgId);
        if (orgId) loadProjects()
    }, []);

    useEffect(() => {
        loadProjects();
    }, [orgId])

    useEffect(() => {
        loadTaskStates();
    }, [projectId]);

    useEffect(() => {
        if (error) {
            navigate("/error", { state: { errorMessage: error.message } });
        }
        if (orgData) {
            if (orgData.organizationByUserId) {
                if (orgData.organizationByUserId.length == 0) {
                    navigate("/createorg", { state: { firstTimeUser: true } });
                } else {
                    setOrganizations(orgData.organizationByUserId);
                }
            }
        }
    }, [orgData, projectData, error]);

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                flexWrap="nowrap"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    boxSizing: "border-box"
                }}
            >
                <NavBar
                    orgId={orgId}
                    projectId={projectId}
                    changeOrg={changeOrg}
                    changeProject={changeProject}
                    organizations={organizations}
                    projects={projects}
                />
                <MainBoard
                    projectId={projectId}
                    taskStates={taskStates}
                    loadTaskStates={loadTaskStates}
                    createState={createState}
                />
            </Box >
        </>
    );
}


export default HomePage;