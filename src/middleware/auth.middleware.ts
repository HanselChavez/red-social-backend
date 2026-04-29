import { Response, NextFunction } from "express";
import {
    verifyAccessToken,
    verifyRefreshToken,
    generateAccessToken,
} from "../utils/jwt";
import { RefreshToken } from "../entities/RefreshToken";
import { AppDataSource } from "../config/data-source";
import { AppError } from "../errors/AppError";
import { HttpStatus } from "../utils/httpStatus";
import { ErrorCode } from "../utils/errorCodes";
import { AuthRequest } from "../types/authRequest";

const refreshRepo = AppDataSource.getRepository(RefreshToken);

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                "No autorizado",
                HttpStatus.UNAUTHORIZED,
                ErrorCode.AUTH_UNAUTHORIZED,
            );
        }

        const accessToken = authHeader.split(" ")[1];

        try {
            const decoded = verifyAccessToken(accessToken);
            req.user = decoded;
            return next();
        } catch {}

        const refreshToken = req.headers["x-refresh-token"] as string;

        if (!refreshToken) {
            throw new AppError(
                "Token expirado",
                HttpStatus.UNAUTHORIZED,
                ErrorCode.AUTH_TOKEN_EXPIRED,
            );
        }

        const stored = await refreshRepo.findOne({
            where: { token: refreshToken },
        });

        if (!stored) {
            throw new AppError(
                "Refresh inválido",
                HttpStatus.UNAUTHORIZED,
                ErrorCode.SESSION_NOT_FOUND,
            );
        }

        const payload = verifyRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken({
            id: payload.id,
            email: payload.email,
            role: payload.role,
        });

        res.setHeader("x-access-token", newAccessToken);

        req.user = payload;

        next();
    } catch (error) {
        next(error);
    }
};

export const adminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.user) {
        return next(
            new AppError(
                "No autenticado",
                HttpStatus.UNAUTHORIZED,
                ErrorCode.AUTH_UNAUTHORIZED,
            ),
        );
    }

    if (req.user.role !== "admin") {
        return next(
            new AppError(
                "Solo admin",
                HttpStatus.FORBIDDEN,
                ErrorCode.AUTH_UNAUTHORIZED,
            ),
        );
    }

    next();
};
