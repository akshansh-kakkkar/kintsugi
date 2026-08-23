"use server";

import { shipProject } from "./ship";

export async function submitShipProject(projectId : number, selectedProjects : string[]){
    return await shipProject(
        projectId, "", selectedProjects
    )
}