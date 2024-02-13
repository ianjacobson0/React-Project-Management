import { CircularProgress } from "@mui/material";
import React from "react";

const Spinner = () => {
    return (
        <div className="spinner-container">
            <CircularProgress className="spinner" />
        </div>
    )
}
export default Spinner;