import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ROLES_BY_ORG_ID } from "../../queries/organizationQueries";
import { INVITE } from "../../queries/inviteQueries";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InviteOrgPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orgId = parseInt(location.state.orgId || "0");

    if (orgId === 0) navigate("/");

    const [invite, { loading }] = useMutation(INVITE);
    const { data, loading: rolesLoading } = useQuery(ROLES_BY_ORG_ID, {
        variables: {
            id: orgId
        }
    });

    const [expiry, setExpiry] = useState("0");
    const [orgRoleId, setOrgRoleId] = useState(0);
    const [expiryError, setExpiryError] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isNaN(expiry as any)) {
            setExpiryError(true);
            setExpiry("");
            return;
        } else {
            setExpiryError(false);
        }
        const input = {
            orgId: orgId,
            orgRoleId: orgRoleId,
            expireMinutes: parseInt(expiry)
        }
        invite({
            variables: {
                input: input
            }
        }).then(({ data }) => {
            setShowCode(true);
            setCode(data.invite.joinCode);
        });
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", height: "100%" }}
        >
            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <InputLabel>Minutes Expiry:</InputLabel>
                    <TextField
                        required
                        label={"Expiry"}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        error={expiryError}
                        sx={{ width: "300px" }}
                    />
                    {expiryError &&
                        <Typography variant="caption" color="error">
                            Enter a number
                        </Typography>}
                    <InputLabel>Role:</InputLabel>
                    <Select
                        required
                        value={orgRoleId}
                        onChange={(e) => setOrgRoleId(parseInt(e.target.value as any))}
                        sx={{ width: "300px" }}
                    >
                        {data?.rolesByOrgId &&
                            data.rolesByOrgId.map((o: any) => {
                                return (<MenuItem value={o.id as any}>{o.name}</MenuItem>)
                            })
                        }
                    </Select>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={(e) => navigate("/editorganization", {
                                state: {
                                    orgId: orgId
                                }
                            })}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            sx={{ display: "block", marginTop: "5px" }}
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </Box>
                    {showCode &&
                        <Typography>invite code: {code}</Typography>
                    }
                </Box>
            </Box>
        </Grid>
    );
}

export default InviteOrgPage;