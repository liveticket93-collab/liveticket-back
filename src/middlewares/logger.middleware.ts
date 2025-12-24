import { Response, Request, NextFunction } from "express";

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const date = new Date();
  console.log(`Access to route ${req.url}, ${req.method} at ${date}`);
  next();
}
