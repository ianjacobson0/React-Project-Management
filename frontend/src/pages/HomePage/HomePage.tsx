import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { CHECK_ORG_BY_USER_ID } from "../../queries/organizationQueries";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";
import { CHECK_PROJ_BY_USER_ID } from "../../queries/projectQueries";

const HomePage = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");
    console.log(userId);
    const { data: orgData, loading, error } = useQuery(CHECK_ORG_BY_USER_ID, {
        variables: { id: parseInt(userId || "0") }
    });
    const { data: projectData, loading: projectLoading } = useQuery(CHECK_PROJ_BY_USER_ID, {
        variables: { id: parseInt(userId || "0") }
    })

    useEffect(() => {
        if (error) {
            navigate("/error", { state: { errorMessage: error.message } });
        }
        if (orgData) {
            if (orgData.organizationByUserId) {
                if (orgData.organizationByUserId.length == 0) {
                    navigate("/createorg", { state: { firstTimeUser: true } });
                }
            }
        }

        if (projectData && projectData.checkProjectByUserId) {
            if (projectData.checkProjectByUserId.length == 0) {
                navigate("/createproject", { state: { firstTimeUser: true } });
            }
        }
    }, [orgData, error]);

    if (loading || projectLoading) {
        return <Spinner />
    }

    return (
        <div>
            hello
        </div>
    );
}


export default HomePage;