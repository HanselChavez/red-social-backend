import * as userService from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";
import { HttpStatus } from "../utils/httpStatus";
import { ErrorCode } from "../utils/errorCodes";
import { sendResponse } from "../utils/response";

export const create = asyncHandler(async (req, res) => {
    const result = await userService.createUser(req.body);

    return sendResponse(res, result, "Usuario creado", HttpStatus.CREATED);
});

export const getAll = asyncHandler(async (_req, res) => {
    const users = await userService.getUsers();

    return sendResponse(res, users, "Usuarios obtenidos");
});

export const getById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await userService.getUserById(Number(id));

    if (!user) {
        throw new AppError(
            "Usuario no encontrado",
            HttpStatus.NOT_FOUND,
            ErrorCode.USER_NOT_FOUND,
        );
    }
    return sendResponse(res, user);
});

export const update = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const user = await userService.updateUser(id, req.body);
    return sendResponse(res, user, "Usuario Actualizado");
});

export const remove = asyncHandler(async (req, res) => {
    await userService.deleteUser(Number(req.params.id));

    return sendResponse(res, null, "Usuario eliminado");
});
