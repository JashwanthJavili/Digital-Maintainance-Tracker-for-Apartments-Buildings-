import express from "express";
import * as controller from "../controllers/resident.controller";

const router = express.Router();

router.post("/request", controller.createRequest);
router.get("/requests/:id", controller.getRequests);
router.put("/feedback/:id", controller.submitFeedback);

export default router;
