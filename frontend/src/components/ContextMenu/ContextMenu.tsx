type Props = {
    children: React.ReactNode,
    top: number;
    left: number
}

const ContextMenu = ({ children, top, left }: Props) => {
    return (
        <div style={{
            position: "fixed",
            top: `${top}px`,
            left: `${left}px`
        }}>
            {children}
        </div>
    );
}

export default ContextMenu;