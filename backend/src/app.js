// import express from "express";
// import cors from "cors";
// import { env } from "./config/env.js";
// import authRoutes from "./routes/authRoutes.js";
// import alumniRoutes from "./routes/alumniRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// const app = express();

// const allowedOrigins = env.clientUrl
//   ? env.clientUrl.split(",").map((origin) => origin.trim())
//   : ["http://localhost:5173"];

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true
//   })
// );

// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true }));

// app.get("/api/health", (_req, res) => {
//   res.json({ status: "ok", service: "amisphere-api" });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/alumni", alumniRoutes);
// app.use("/api/upload", uploadRoutes);

// app.use(notFound);
// app.use(errorHandler);

// export default app;

// app.get("/", (req, res) => {
//   res.json({
//     status: "success",
//     app: "AmiSphere Backend",
//     message: "Backend running successfully"
//   });
// });


import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

// Parse origins safely
const allowedOrigins = env.clientUrl
  ? env.clientUrl.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

// 1. Core Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
  if (!origin) {
    return callback(null, true);
  }

  if (
    allowedOrigins.includes(origin) ||
    origin.includes("vaivasvatmathurs-projects.vercel.app")
  ) {
    return callback(null, true);
  }

  console.warn(`CORS Blocked Origin: ${origin}`);
  return callback(new Error("Not allowed by CORS"), false);
},
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// 2. Base/Health Routes (Placed BEFORE error handlers)
app.get("/", (req, res) => {
  res.json({
    status: "success",
    app: "AmiSphere Backend",
    message: "Backend running successfully"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "amisphere-api" });
});

// 3. Application API Routes
app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/upload", uploadRoutes);

// 4. Error Handling Middlewares (Must be at the very bottom)
app.use(notFound);
app.use(errorHandler);

export default app;