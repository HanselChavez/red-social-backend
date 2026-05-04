import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes"
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { AppError } from "./errors/AppError";
import path from "path";

const app = express();
console.log("DB_HOST:", process.env.DB_HOST);
// app.use(cors({
//   origin: "*",
//   credentials: true
// }))

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



app.use(express.json());

/*Con esto la iamgen se guardará en la carpeta post */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.get("/error", (req, res, next) => {
  next(new AppError("Error de prueba", 500));
});

app.use(errorMiddleware);

export default app;
