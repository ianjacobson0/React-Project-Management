import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_ORG_ROLE, DELETE_ORG_ROLE, ORG_ROLE_BY_ID, ROLES_BY_ORG_ID, UPDATE_ORG_ROLE } from "../../../queries/organizationQueries";
import Spinner from "../../../components/Spinner/Spinner";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import Divider from '@mui/material/Divider';

const RoleStage = ({ orgId }: { orgId: number }) => {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useQuery(ROLES_BY_ORG_ID, { variables: { id: orgId } });
    const [getOrgRoleById, { loading: roleLoading }] = useLazyQuery(ORG_ROLE_BY_ID);
    const [createOrgRole, { loading: createLoading }] = useMutation(CREATE_ORG_ROLE);
    const [deleteOrgRole, { loading: deleteLoading }] = useMutation(DELETE_ORG_ROLE);
    const [updateOrgRole, { loading: updateLoading }] = useMutation(UPDATE_ORG_ROLE);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        { field: "name", headerName: "Name" },
        { field: "admin", headerName: "Admin" },
        { field: "canViewAll", headerName: "Can View All Projects", width: 150 },
        { field: "canCreateProject", headerName: "Can Create Projects", width: 150 },
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
    const [canViewAll, setCanViewAll] = useState(false as any);
    const [canCreateProject, setCanCreateProject] = useState(false as any);

    const deleteRole = (id: number) => {
        deleteOrgRole({ variables: { id: id } })
            .then((_) => refetch())
            .catch((err) => navigate("/error", { state: { errorMessage: err.message } }));
    }

    const editRole = (id: number) => {
        setMode("edit");
        getOrgRoleById({ variables: { id: id } })
            .then(({ data }) => {
                if (data.orgRole) {
                    setRoleId(parseInt(data.orgRole.id));
                    setRoleName(data.orgRole.name);
                    setAdmin(data.orgRole.admin);
                    setCanViewAll(data.orgRole.canViewAll);
                    setCanCreateProject(data.orgRole.canCreateProject);
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
                orgId: orgId,
                name: roleName,
                admin: admin,
                canViewAll: canViewAll,
                canCreateProject: canCreateProject
            }
            createOrgRole({
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
                orgId: orgId,
                name: roleName,
                admin: admin,
                canViewAll: canViewAll,
                canCreateProject: canCreateProject
            }
            updateOrgRole({ variables: { input } })
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
            setRows(data.rolesByOrgId);
        }
    }, [data])

    if (orgId == -1) {
        navigate("/error", { state: { errorMessage: "organization does not exist..." } });
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
                        <InputLabel>View All?</InputLabel>
                        <Select
                            required
                            value={canViewAll}
                            onChange={(e) => setCanViewAll(e.target.value)}
                            displayEmpty
                            sx={{ marginRight: "10px", height: "40px" }}
                        >
                            <MenuItem value={true as any}>True</MenuItem>
                            <MenuItem value={false as any}>False</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <InputLabel>Create?</InputLabel>
                        <Select
                            required
                            value={canCreateProject}
                            onChange={(e) => setCanCreateProject(e.target.value)}
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
                <Button color="inherit" variant="contained" sx={{ width: "100%" }} onClick={(e) => navigate("/")}>Done</Button>
            </Box >
        </>
    );
}

export default RoleStage;