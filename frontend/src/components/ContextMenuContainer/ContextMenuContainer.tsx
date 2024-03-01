import { useEffect, useState } from "react";
import { ContextMenuFunctionMap, ContextMenuItem } from "../../types/context-menu-types";
import ContextMenu from "../ContextMenu/ContextMenu";

type Props = {
    children: React.ReactNode,
    functionMap: ContextMenuFunctionMap[],
    items: ContextMenuItem[]
}

const ContextMenuContainer = ({ children, functionMap, items }: Props) => {
    const [clicked, setClicked] = useState(false);
    const [points, setPoints] = useState({
        x: 0,
        y: 0
    });

    useEffect(() => {
        const handleClick = () => setClicked(false);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <>
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    setClicked(true);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY
                    });
                }}
                onScroll={() => {
                    setClicked(false)
                }}
            >
                {children}
            </div>
            {clicked &&
                <ContextMenu top={points.y} left={points.x}>
                    <ul>
                        {items.map((item) => {
                            return (
                                <li>{item.title}</li>
                            );
                        })}
                    </ul>
                </ContextMenu>
            }
        </>
    );
}

export default ContextMenuContainer