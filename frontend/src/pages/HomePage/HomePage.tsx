import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { FormEvent, useEffect, useState } from "react";
import { CHECK_ORG_BY_USER_ID } from "../../queries/organizationQueries";
import { Link, useNavigate } from "react-router-dom";
import { CHECK_PROJ_BY_USER_ID, CREATE_TASK_STATE, DELETE_TASK_STATE, PROJECT_BY_ORG_USER_ID, QUERY_STATE_BY_ID, QUERY_TASK_STATES, UPDATE_TASK_STATE } from "../../queries/projectQueries";
import { Box, Button, Dialog, InputLabel, Menu, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FaPlus, FaX } from "react-icons/fa6";
import TaskState from "./TaskState/TaskState";
import Column from "./Column/Column";
import Tasks from "./Tasks/Tasks";
import NavBar from "../../components/NavBar/NavBar";
import { Organization, Project } from "../../types/graphql-types";

const HomePage = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");
    const { data: orgData, loading, error } = useQuery(CHECK_ORG_BY_USER_ID, {
        variables: { id: parseInt(userId || "0") },
        fetchPolicy: "network-only"
    });
    const { data: projectData, loading: projectLoading } = useQuery(CHECK_PROJ_BY_USER_ID, {
        variables: { id: parseInt(userId || "0") },
        fetchPolicy: "network-only"
    });
    const [queryTaskStates, { loading: statesLoading }] = useLazyQuery(QUERY_TASK_STATES, { fetchPolicy: "network-only" });
    const [queryProjectsByOrgId, { loading: projectByOrgLoading }] = useLazyQuery(PROJECT_BY_ORG_USER_ID, { fetchPolicy: "network-only" });
    const [createTaskState, { loading: createStateLoading }] = useMutation(CREATE_TASK_STATE);
    const [orgId, setOrgId] = useState(0);
    const [projectId, setProjectId] = useState(0);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [taskStates, setTaskStates] = useState<any[]>([]);

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
                <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="nowrap"
                    justifyContent="start"
                    alignItems="start"
                    sx={{
                        backgroundColor: "#ffffff",
                        padding: "10px",
                        borderRadius: "10px",
                        width: "100%",
                        boxSizing: "border-box",
                        height: "calc(100vh - 80px)",
                        overflowX: "scroll"
                    }}
                >
                    {taskStates.map((o) => {
                        return (
                            <Column stateObj={o} key={o.id}>
                                <TaskState o={o} loadTaskStates={loadTaskStates} />
                                <Tasks stateId={parseInt(o.id)} />
                            </Column>
                        );
                    })}
                    {orgId !== 0 && projectId !== 0 &&
                        <Box
                            display="flex"
                            sx={{ height: "95%", width: "200px", borderRadius: "20px", margin: "0", boxSizing: "border-box" }}
                            flexDirection="column"
                            flexWrap="nowrap"
                            justifyContent="start"
                            alignItems="center"
                            marginX="10px"
                        >
                            <Box
                                display="flex"
                                flexDirection="row"
                                flexWrap="nowrap"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    backgroundColor: "#E8E8E8",
                                    height: "150x",
                                    width: "200px",
                                    padding: "5px",
                                    boxSizing: "border-box",
                                    borderRadius: "0",
                                    cursor: "pointer",
                                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
                                }}
                                position="relative"
                                onClick={(e) => createState()}
                            >
                                <FaPlus size={15} />
                            </Box>
                        </Box>}
                </Box>
            </Box >
        </>
    );
}


export default HomePage;