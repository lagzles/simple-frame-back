import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { getStringParam } from "../../utils/params.js";
import { saveLoadCasesSchema } from "./load-case.schemas.js";
import * as loadCaseService from "./load-case.service.js";

export const loadCaseRouter = Router();

loadCaseRouter.use(requireAuth);

loadCaseRouter.put(
  "/frames/:frameId/load-cases",
  asyncHandler(async (req, res) => {
    const frameId = getStringParam(req.params.frameId, "frameId");
    const input = saveLoadCasesSchema.parse(req.body);
    const loadCases = await loadCaseService.saveLoadCases(req.user!.id, frameId, input);
    res.json({ frameId, loadCases });
  }),
);
