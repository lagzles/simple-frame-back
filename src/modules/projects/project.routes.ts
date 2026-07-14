import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { createProjectSchema } from "./project.schemas.js";
import * as projectService from "./project.service.js";

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const projects = await projectService.listProjects(req.user!.id);
    res.json({ projects });
  }),
);

projectRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createProjectSchema.parse(req.body);
    const project = await projectService.createProject(req.user!.id, input);
    res.status(201).json(project);
  }),
);
