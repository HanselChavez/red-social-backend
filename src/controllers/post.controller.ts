import * as postService from "../services/post.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { sendResponse } from "../utils/response";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { Post } from "../entities/Post";
import { User } from "../entities/User";


export const create = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const imageUrl = req.file
        ? `/uploads/posts/${req.file.filename}`
        : null;

    const result = await postService.createPost(userId, {
        ...req.body,
        imageUrl,
    });

    return sendResponse(res, result, "Post creado", HttpStatus.CREATED);
});

export const getAll = asyncHandler(async (req, res) => {
    const result = await postService.getPosts();

    return sendResponse(res, result, "Posts obtenidos");
});

export const getOne = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const result = await postService.getPostById(id);

    return sendResponse(res, result, "Post obtenido");
});

export const update = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = Number(req.params.id);

    const result = await postService.updatePost(userId, postId, req.body);

    return sendResponse(res, result, "Post actualizado");
});

export const remove = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = Number(req.params.id);

    const result = await postService.deletePost(userId, postId);

    return sendResponse(res, result, "Post eliminado");
});
export const getMyPosts = asyncHandler(async (req, res) => {
    const result = await postService.getMyPosts(req.user!.id);

    return sendResponse(res, result, "Posts obtenidos");
});
export const updateVisibility = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { visibility } = req.body;

    const result = await postService.updatePostVisibility(
        Number(id),
        req.user.id,
        visibility,
    );

    return sendResponse(res, result, "Visibilidad actualizada");
});

/* Creando el createPost para las imagenes*/
export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { content, visibility } = req.body;

        const imageUrl = req.file
            ? `/uploads/posts/${req.file.filename}`
            : null;

        const postRepository = AppDataSource.getRepository(Post);
        const userRepository = AppDataSource.getRepository(User);

        const userId = (req as any).user.id;

        const user = await userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado",
            });
            return;
        }

        const newPost = postRepository.create({
            content,
            visibility: visibility || "public",
            createdAt: new Date(),
            imageUrl,
            user,
        });

        const savedPost = await postRepository.save(newPost);

        res.status(201).json({
            message: "Post creado correctamente",
            post: savedPost,
        });
    } catch (error) {
        next(error);
    }
};
