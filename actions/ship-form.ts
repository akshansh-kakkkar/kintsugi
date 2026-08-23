"use server";

import { requireAuth } from "@/lib/auth-guard";
import { shipProject } from "./ship";
import { db } from "@/db";
import { and, desc, eq, isNull } from "drizzle-orm";
import { projects, shipEvents } from "@/db/schema";

export async function submitShipProject(projectId: number, selectedProjects: string[]) {
    return await shipProject(
        projectId, "", selectedProjects
    )
}

export async function getProjectBack(projectId: number) {
    try {
        const session = await requireAuth();
        const project = await db.query.projects.findFirst({
            where: and(
                eq(projects.id, projectId),
                eq(projects.userId, session.id),
            ),
        });
        if (!project) {
            return {
                success: false,
                error: "Project not found",
            };
        }
        const latestShipEvent = await db.query.shipEvents.findFirst({
            where: and(
                eq(shipEvents.projectId, projectId),
                eq(shipEvents.userId, session.id),
                isNull(shipEvents.withdrawnAt)
            ),
            orderBy: [desc(shipEvents.createdAt)],
        })
        if (!latestShipEvent) {
            return {
                success: false,
                error: "Project is not currently shipped"
            }
        }
        await db.update(shipEvents).set({
            withdrawnAt: new Date
        }).where(eq(shipEvents.id, latestShipEvent.id));

        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to get project back"
        }
    }
}