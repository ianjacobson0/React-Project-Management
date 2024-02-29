import { useState } from "react";
import { Organization } from "../../types/graphql-types";

type Props = {
    orgs: Organization[],
    changeOrg: (id: number) => void
}

const NavItemOrg = ({ orgs, changeOrg }: Props) => {
    const [style, setStyle] = useState<React.CSSProperties>({ display: "none" });

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
            <div className="nav-item-title">Current Organization</div>
            <div className="nav-menu-container" style={style}>
                <div className="nav-menu-hidden"></div>
                <div className="nav-menu-visible">
                    {orgs.map(org => {
                        return (
                            <div
                                key={org.id}
                                className="nav-menu-item"
                                onClick={(e) => {
                                    changeOrg(org.id);
                                    setStyle({ display: "none" });
                                }}
                            >
                                {org.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default NavItemOrg;