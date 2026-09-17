import "dotenv/config";
import express from "express";
import { connectDB } from "./db";
import cors from "cors";
import morgan from "morgan";
import { ok } from "./utils/envelope";
import { errorHandler } from "./middlewares/errHandler.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { clerkMiddleware } from "@clerk/express";
import { authRouter } from "./routes/auth/auth.routes";

async function mainEntry() {
  await connectDB();

  const app = express();

  // add both the origins
  const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(morgan("dev"));
  app.use(clerkMiddleware());

  // endpoints
  app.get("/health", (_req, res) => {
    res.status(200).json(ok({ message: "Server is healthy & runnning ✅" }));
  });

  // custom-middlewares
  app.use(notFound);
  app.use(errorHandler);

  // auth. routes
  app.use("/auth", authRouter);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
}

mainEntry().catch((err) => {
  console.error("🔴 failed to start:", err);
  process.exit(1);
});
