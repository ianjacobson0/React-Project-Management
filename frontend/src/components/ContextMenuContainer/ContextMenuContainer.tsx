import { useContext, useEffect, useState } from "react";
import { ContextMenuFunctionMap, ContextMenuItem } from "../../types/context-menu-types";
import ContextMenu from "../ContextMenu/ContextMenu";
import { ContextMenuContext } from "../MainBoard/MainBoard";

type Props = {
    children: React.ReactNode,
    functionMap: ContextMenuFunctionMap[],
    items: ContextMenuItem[],
    type: string,
    id: number
}

const ContextMenuContainer = ({ children, functionMap, items, type, id }: Props) => {
    const { open, close, currentId } = useContext(ContextMenuContext);
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

    useEffect(() => {
        if (clicked && currentId != "" && (type + id.toString()) != currentId) {
            setClicked(false);
            close();
        }
    }, [currentId]);

    return (
        <>
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    setClicked(prevClicked => {
                        if (!prevClicked) {
                            open(type + id.toString())
                        }
                        return true
                    });
                    setPoints({
                        x: e.pageX,
                        y: e.pageY
                    });
                }}
                onScroll={() => {
                    //setClicked(false)
                }}
            >
                {children}
            </div>
            {clicked &&
                <ContextMenu top={points.y} left={points.x}>
                    <ul>
                        {items.map((item) => {
                            return (
                                <li
                                    onClick={(e) => {
                                        const func = functionMap.find(o => o.id == item.id)?.action;
                                        if (func) func();
                                        setClicked(false);
                                    }}
                                >{item.title}</li>
                            );
                        })}
                    </ul>
                </ContextMenu>
            }
        </>
    );
}

export default ContextMenuContainer