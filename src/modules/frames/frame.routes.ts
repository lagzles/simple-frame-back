import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { getStringParam } from "../../utils/params.js";
import { frameGenerateSchema } from "./frame.schemas.js";
import * as frameService from "./frame.service.js";
import { presentFrameModel } from "./frame.presenter.js";

export const frameRouter = Router();

frameRouter.use(requireAuth);

frameRouter.post(
  "/modulations/:modulationId/frames/generate",
  asyncHandler(async (req, res) => {
    const modulationId = getStringParam(req.params.modulationId, "modulationId");
    const input = frameGenerateSchema.parse(req.body);
    const frame = await frameService.generateAndSaveFrame(req.user!.id, modulationId, input);
    res.status(201).json(presentFrameModel(frame));
  }),
);
