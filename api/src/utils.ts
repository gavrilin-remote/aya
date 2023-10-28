import { type Request, type Response, type RequestHandler, type NextFunction } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next?: NextFunction) => Promise<void>;
export const wrapAsyncError = (handler: AsyncRequestHandler): RequestHandler => {
  return (req, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
};
