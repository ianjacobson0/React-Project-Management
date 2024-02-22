import { useNavigate } from "react-router-dom";
import { HomePageState, NavItemInfo } from "../../types/navbar-types";
import { useState } from "react";

type Props = {
    title: string,
    info: NavItemInfo[],
    state: HomePageState
}

const NavItem = ({ title, info, state }: Props) => {
    const navigate = useNavigate();
    const [style, setStyle] = useState<React.CSSProperties>({ display: "none" });

    const hover = (e: React.MouseEvent) => {
        setStyle({ display: "block" });
    }

    const endHover = (e: React.MouseEvent) => {
        setStyle({ display: "none" });
    }

    return (
        <div
            className="nav-item"
            onMouseOver={hover}
            onMouseLeave={endHover}
        >
            <div className="nav-item-title">{title}</div>
            <div className="nav-menu-container" style={style}>
                <div className="nav-menu-hidden"></div>
                <div className="nav-menu-visible">
                    {info.map(item => {
                        return (
                            <div
                                key={item.title}
                                className="nav-menu-item"
                                onClick={(e) => {
                                    navigate(item.link, { state })
                                }}
                            >
                                {item.title}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


export default NavItem;
