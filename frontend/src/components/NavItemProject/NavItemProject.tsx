import { useEffect, useState } from "react";
import { Project } from "../../types/graphql-types";

type Props = {
    projects: Project[] | null,
    changeProject: (id: number) => void
}

const NavItemProject = ({ projects, changeProject }: Props) => {
    const [style, setStyle] = useState<React.CSSProperties>({ display: "none" });
    const [color, setColor] = useState("#87bfea");


    useEffect(() => {
        if (projects && projects.length === 0) setColor("#a2bacd");
        else
            setColor("#464fb6");
    }, [projects])

    const hover = (e: React.MouseEvent) => {
        setStyle({ display: "block" });
    }

    const endHover = (e: React.MouseEvent) => {
        setStyle({ display: "none" });
    }
    return (
        <div
            className="nav-item nav-item-selector"
            onMouseOver={hover}
            onMouseLeave={endHover}
        >
            <div className="nav-item-title" style={{ color: color }}>Change Current Project</div>
            <div className="nav-menu-container" style={style}>
                <div className="nav-menu-hidden"></div>
                <div className="nav-menu-visible">
                    {projects && projects.map(project => {
                        return (
                            <div
                                key={project.id}
                                className="nav-menu-item"
                                onClick={(e) => {
                                    changeProject(project.id);
                                    setStyle({ display: "none" });
                                }}
                            >
                                {project.title}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default NavItemProject;