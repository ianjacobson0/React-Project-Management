import { link } from "fs";

export type NavItemInfo = {
    title: string;
    link: string;
}


export type NavBarInfo = {
    title: string;
    itemInfo: NavItemInfo[];
}
export type HomePageState = {
    orgId: number | null;
    projectId: number | null;
}

export const navBarInfo: NavBarInfo[] = [
    {
        title: "Organization Settings",
        itemInfo: [
            {
                title: "Create",
                link: "/createorg"
            },
            {
                title: "Edit Current",
                link: "/editorganization"
            },
            {
                title: "Join",
                link: "/join"
            },
        ]
    },
    {
        title: "Project Settings",
        itemInfo: [
            {
                title: "Create",
                link: "/createproject"
            },
            {
                title: "Edit Current",
                link: "/editproject"
            },
        ]
    }
]