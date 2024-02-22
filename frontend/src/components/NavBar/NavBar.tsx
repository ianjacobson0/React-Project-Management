import { Box, Button, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { navBarInfo } from "../../types/navbar-types";
import { HomePageState, NavBarInfo } from "../../types/navbar-types";
import NavItem from "../NavItem/NavItem";
import NavItemProject from "../NavItemProject/NavItemProject";
import { Project } from "../../types/graphql-types";
import NavItemOrg from "../NavItemOrg/NavItemOrg";

type Props = {
    orgId: number,
    projectId: number,
    changeOrg: (id: number) => void,
    changeProject: (id: number) => void,
    organizations: any,
    projects: Project[]
}

const NavBar = ({ orgId, projectId, changeOrg, changeProject, organizations, projects }: Props) => {

    const state: HomePageState = {
        orgId: orgId,
        projectId: projectId
    }

    return (
        <div className="navbar">
            <div className="nav-section">
                {navBarInfo.map(item => {
                    return (<NavItem key={item.title} title={item.title} info={item.itemInfo} state={state} />)
                })}
            </div>
            <div className="nav-section">
                <NavItemOrg
                    orgs={organizations}
                    changeOrg={changeOrg}
                />
                <NavItemProject
                    projects={projects}
                    changeProject={changeProject}
                />
            </div>
        </div>
    );
}

export default NavBar;