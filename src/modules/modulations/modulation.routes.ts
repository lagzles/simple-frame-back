import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { getStringParam } from "../../utils/params.js";
import { createModulationSchema } from "./modulation.schemas.js";
import * as modulationService from "./modulation.service.js";

export const modulationRouter = Router();

modulationRouter.use(requireAuth);

modulationRouter.post(
  "/buildings/:buildingId/modulations",
  asyncHandler(async (req, res) => {
    const buildingId = getStringParam(req.params.buildingId, "buildingId");
    const input = createModulationSchema.parse(req.body);
    const modulation = await modulationService.createModulation(req.user!.id, buildingId, input);
    res.status(201).json(modulation);
  }),
);
