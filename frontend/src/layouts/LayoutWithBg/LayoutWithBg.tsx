import React, { useEffect, useState } from "react"
import backgroundImage from "../../assets/images/background.jpg"
import backgroundImageBlurry from "../../assets/images/background-blurry.jpg"
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'

const LayoutWithBg = () => {
    const [bgImage, setBgImage] = useState(backgroundImageBlurry);

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            setBgImage(image.src);
        }
        image.src = backgroundImage;

    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                display="flex"
                flexDirection="row"
                flexWrap="nowrap"
                justifyContent="center"
                alignItems="center"
                sx={{
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url(${bgImage})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <Outlet />
            </Box>
        </DndProvider >
    );
}

export default LayoutWithBg;