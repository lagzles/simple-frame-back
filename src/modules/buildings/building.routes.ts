import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { createBuildingSchema } from "./building.schemas.js";
import * as buildingService from "./building.service.js";
import { presentBuilding } from "./building.presenter.js";

export const buildingRouter = Router();

buildingRouter.use(requireAuth);

buildingRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const buildings = await buildingService.listBuildings(req.user!.id);
    console.log(buildings);
    res.json({ buildings: buildings.map(presentBuilding) });
  }),
);

buildingRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createBuildingSchema.parse(req.body);
    const building = await buildingService.createBuilding(req.user!.id, input);
    res.status(201).json(presentBuilding(building));
  }),
);
