import { Box } from "@mui/material";
import React from "react";


type Props = {
    children: React.ReactNode,
    stateObj: any
}

const Column = ({ children, stateObj }: Props) => {
    return (
        <Box
            display="flex"
            sx={{ height: "95%", width: "200px", borderRadius: "20px", margin: "0 10px", boxSizing: "border-box" }}
            flexDirection="column"
            flexWrap="nowrap"
            justifyContent="start"
            alignItems="center"
            key={stateObj.id}
        >
            {children}
        </Box>
    );
}

export default Column;