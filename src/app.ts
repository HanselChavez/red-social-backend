import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { AppError } from "./errors/AppError";

const app = express();
console.log("DB_HOST:", process.env.DB_HOST);
// app.use(cors({
//   origin: "*",
//   credentials: true
// }))

const allowedOrigins = ["*",process.env.FRONTEND_URL];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

app.get("/error", (req, res, next) => {
    next(new AppError("Error de prueba", 500));
});

app.use(errorMiddleware);

export default app;
