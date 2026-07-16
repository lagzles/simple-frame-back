import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { getStringParam } from "../../utils/params.js";
import { createModulationSchema } from "./modulation.schemas.js";
import * as modulationService from "./modulation.service.js";
import { presentModulation } from "./modulation.presenter.js";

export const modulationRouter = Router();

modulationRouter.use(requireAuth);

modulationRouter.post(
  "/buildings/:buildingId/modulations",
  asyncHandler(async (req, res) => {
    const buildingId = getStringParam(req.params.buildingId, "buildingId");
    const input = createModulationSchema.parse(req.body);
    const modulation = await modulationService.createModulation(req.user!.id, buildingId, input);
    res.status(201).json(presentModulation(modulation));
  }),
);

modulationRouter.get(
  "/buildings/:buildingId/modulations",
  asyncHandler(async (req, res) => {
    const buildingId = getStringParam(req.params.buildingId, "buildingId");
    const modulations = await modulationService.listModulations(req.user!.id, buildingId);
    res.json({ modulations: modulations.map(presentModulation) });
  }),
);

modulationRouter.get(
  "/modulations/:modulationId",
  asyncHandler(async (req, res) => {
    const modulationId = getStringParam(req.params.modulationId, "modulationId");
    const modulation = await modulationService.getModulation(req.user!.id, modulationId);
    res.json(presentModulation(modulation));
  }),
);
