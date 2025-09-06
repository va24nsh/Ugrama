import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const type = req?.user?.role;

    if (!type || !allowedRoles.includes(type)) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    } else {
      next();
    }
  };
};
