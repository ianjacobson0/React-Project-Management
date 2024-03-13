import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { FormEvent, useEffect, useState } from "react";
import { CREATE_PROJECT_ROLE, DELETE_PROJECT_ROLE, QUERY_PROJECT_ROLES, QUERY_PROJECT_ROLE_BY_ID, UPDATE_PROJECT_ROLE } from "../../../queries/projectQueries";
import { useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { Box, Button, Divider, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Spinner from "../../../components/Spinner/Spinner";

const RoleStage = ({ projectId }: { projectId: number }) => {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useQuery(QUERY_PROJECT_ROLES, { variables: { id: projectId } });
    const [getProjRoleById, { loading: roleLoading }] = useLazyQuery(QUERY_PROJECT_ROLE_BY_ID);
    const [createProjRole, { loading: createLoading }] = useMutation(CREATE_PROJECT_ROLE);
    const [deleteProjRole, { loading: deleteLoading }] = useMutation(DELETE_PROJECT_ROLE);
    const [updateProjRole, { loading: updateLoading }] = useMutation(UPDATE_PROJECT_ROLE);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        { field: "name", headerName: "Name" },
        { field: "admin", headerName: "Admin" },
        { field: "canEditAllTasks", headerName: "Can Edit All Tasks", width: 150 },
        { field: "canEditAllStates", headerName: "Can Edit All States", width: 150 },
        {
            field: "",
            headerName: "",
            width: 50,
            editable: false,
            renderCell: (params: any) => {
                return (
                    <AiFillEdit size={20} style={{ cursor: "pointer" }} onClick={(e) => editRole(parseInt(params.row.id))} />
                );
            }
        },
        {
            field: "id",
            headerName: "",
            width: 50,
            editable: false,
            renderCell: (params: any) => {
                return (
                    <FaTrash size={15} style={{ cursor: "pointer" }} onClick={(e) => deleteRole(parseInt(params.value))} />
                );
            }
        }
    ]);
    const [mode, setMode] = useState("create");
    const [roleId, setRoleId] = useState(0);
    const [roleName, setRoleName] = useState("");
    const [admin, setAdmin] = useState(false as any);
    const [canEditAllTasks, setCanEditAllTasks] = useState(false as any);
    const [canEditAllStates, setCanEditAllStates] = useState(false as any);

    const deleteRole = (id: number) => {
        deleteProjRole({ variables: { id: id } })
            .then((_) => refetch())
            .catch((err) => navigate("/error", { state: { errorMessage: err.message } }));
    }

    const editRole = (id: number) => {
        setMode("edit");
        getProjRoleById({ variables: { id: id } })
            .then(({ data }) => {
                if (data.projectRole) {
                    setRoleId(parseInt(data.projectRole.id));
                    setRoleName(data.projectRole.name);
                    setAdmin(data.projectRole.admin);
                    setCanEditAllStates(data.projectRole.canEditAllStates);
                    setCanEditAllTasks(data.projectRole.canEditAllTasks);
                }
            })
            .catch((err) => {
                navigate("/error", { state: { errorMessage: err.message } });
            })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (mode == "create") {
            const input = {
                projectId: projectId,
                name: roleName,
                admin: admin,
                canEditAllTasks: canEditAllTasks,
                canEditAllStates: canEditAllStates
            }
            createProjRole({
                variables: {
                    input
                }
            })
                .then(({ data }) => {
                    refetch();
                })
                .catch((err) => {
                    navigate("/error", { state: { errorMessage: err.message } });
                })
        } else if (mode == "edit") {
            const input = {
                id: roleId,
                projectId: projectId,
                name: roleName,
                admin: admin,
                canEditAllTasks: canEditAllTasks,
                canEditAllStates: canEditAllStates
            }
            updateProjRole({ variables: { input } })
                .then(({ data }) => {
                    refetch();
                })
                .catch((err) => {
                    navigate("/error", { state: { errorMessage: err.message } });
                })

        }
    }

    useEffect(() => {
        if (data) {
            setRows(data.projectRolesByProjectId);
        }
    }, [data])

    if (projectId == 0) {
        navigate("/error", { state: { errorMessage: "project does not exist..." } });
    }
    if (error) {
        navigate("/error", { state: { errorMessage: error.message } });
    }
    if (loading || createLoading || deleteLoading || roleLoading || updateLoading) {
        return <Spinner />
    }
    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxHeight="500px"
            >
                <Typography variant="h4" component="h4" sx={{ marginBottom: "20px" }}>Roles</Typography>
                {data && <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick={true}
                    sx={{ marginBottom: "20px" }}
                />}
                <Divider variant="fullWidth" flexItem />
                <Typography variant="subtitle1" sx={{ marginTop: "20px" }}>
                    <b>
                        {mode == "create" && "Create"}
                        {mode == "edit" && "Edit"}
                    </b>
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    maxHeight="500px"
                    marginBottom={2}
                >
                    <div>
                        <InputLabel>Role name</InputLabel>
                        <TextField
                            required
                            id="role-name"
                            label="Name"
                            variant="outlined"
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            sx={{ marginRight: "10px", height: "40px" }}
                            autoComplete="off"
                            size="small"
                        />
                    </div>
                    <div>
                        <InputLabel>Admin</InputLabel>
                        <Select
                            required
                            value={admin}
                            onChange={(e) => setAdmin(e.target.value)}
                            displayEmpty
                            sx={{ marginRight: "10px", height: "40px" }}
                        >
                            <MenuItem value={true as any}>True</MenuItem>
                            <MenuItem value={false as any}>False</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <InputLabel>Edit All Tasks?</InputLabel>
                        <Select
                            required
                            value={canEditAllTasks}
                            onChange={(e) => setCanEditAllTasks(e.target.value)}
                            displayEmpty
                            sx={{ marginRight: "10px", height: "40px" }}
                        >
                            <MenuItem value={true as any}>True</MenuItem>
                            <MenuItem value={false as any}>False</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <InputLabel>Edit All States?</InputLabel>
                        <Select
                            required
                            value={canEditAllStates}
                            onChange={(e) => setCanEditAllStates(e.target.value)}
                            displayEmpty
                            sx={{ marginRight: "10px", height: "40px" }}
                        >
                            <MenuItem value={true as any}>True</MenuItem>
                            <MenuItem value={false as any}>False</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained">Submit</Button>
                    </div>
                </Box>
                {mode == "edit" && <Button color="inherit" variant="outlined" onClick={(e) => setMode("create")}>Create</Button>}
                <Button color="inherit" variant="contained" sx={{ marginTop: "10px", width: "100%" }} onClick={(e) => navigate("/")}>Done</Button>
            </Box >
        </>
    )
}

export default RoleStage;