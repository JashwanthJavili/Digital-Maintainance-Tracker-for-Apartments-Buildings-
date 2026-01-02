import { Request, Response } from "express";
import * as service from "../services/resident.service";

export const createRequest = async (req: Request, res: Response) => {
  const result = await service.createRequest(req.body);
  res.json(result);
};

export const getRequests = async (req: Request, res: Response) => {
  const residentId = Number(req.params.id);
  const result = await service.getRequestsByResident(residentId);
  res.json(result);
};

export const submitFeedback = async (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  const { rating, comment } = req.body;
  const result = await service.submitFeedback(requestId, rating, comment);
  res.json(result);
};
