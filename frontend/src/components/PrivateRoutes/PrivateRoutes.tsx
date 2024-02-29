import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Spinner from "../Spinner/Spinner";

const PrivateRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            const url = `${process.env.REACT_APP_API_ENDPOINT}/verify`;
            const data = { token: sessionStorage.getItem("token") }
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    setIsAuthenticated(data.success);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                })
        } else {
            setIsLoading(false);
        }
    }, [])


    if (isLoading) {
        return <Spinner />
    }

    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoutes;