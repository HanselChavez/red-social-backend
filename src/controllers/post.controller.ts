import * as postService from "../services/post.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { sendResponse } from "../utils/response";

// CREATE
export const create = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await postService.createPost(userId, req.body);

    return sendResponse(res, result, "Post creado", HttpStatus.CREATED);
});

// GET ALL
export const getAll = asyncHandler(async (req, res) => {
    const result = await postService.getPosts();

    return sendResponse(res, result, "Posts obtenidos");
});

// GET ONE
export const getOne = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const result = await postService.getPostById(id);

    return sendResponse(res, result, "Post obtenido");
});

// UPDATE
export const update = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = Number(req.params.id);

    const result = await postService.updatePost(userId, postId, req.body);

    return sendResponse(res, result, "Post actualizado");
});

// DELETE
export const remove = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = Number(req.params.id);

    const result = await postService.deletePost(userId, postId);

    return sendResponse(res, result, "Post eliminado");
});
export const getMyPosts = asyncHandler(async (req, res) => {
    console.log(req)
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
