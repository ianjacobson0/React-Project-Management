import React, { useEffect, useState } from "react"
import backgroundImage from "../../assets/images/background.jpg"
import backgroundImageBlurry from "../../assets/images/background-blurry.jpg"
import { Outlet } from "react-router-dom";

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
        <div style={{
            height: "100vh",
            width: "100vw",
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
        }}>
            <Outlet />
        </div>
    );
}

export default LayoutWithBg;