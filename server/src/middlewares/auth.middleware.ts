import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { UserModel } from "../models/User.model";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new AppError(401, "AUTH. ERROR - User is not logged-in"));
  }
  next();
}

// read authenticated/logged-in user
export async function getDbUserFromReq(req: Request) {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError(401, "AUTH. ERROR - User is not logged-in");
  }

  const dbUser = await UserModel.findOne({ clerkUserId: userId });

  if (!dbUser) {
    throw new AppError(404, "User not found!");
  }

  return dbUser;
}

// admin gate
// user logged-in + admin access

export const requireAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const extractCurrDbUser = await getDbUserFromReq(req);

    if (extractCurrDbUser.role !== "admin") {
      throw new AppError(403, "UNAUTHORIZED - Admin access required!");
    }
    next();
  },
);
