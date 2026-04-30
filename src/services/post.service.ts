import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { AppError } from "../errors/AppError";
import { ErrorCode } from "../utils/errorCodes";
import { HttpStatus } from "../utils/httpStatus";
import { CreatePostDto, UpdatePostDto } from "../dtos/post.dto";

const postRepo = AppDataSource.getRepository(Post);
const userRepo = AppDataSource.getRepository(User);

// ✅ CREATE
export const createPost = async (userId: number, data: CreatePostDto) => {
    const user = await userRepo.findOne({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(
            "Usuario no encontrado",
            HttpStatus.NOT_FOUND,
            ErrorCode.USER_NOT_FOUND,
        );
    }

    const post = postRepo.create({
        content: data.content,
        visibility: data.visibility || "public",
        user,
    });

    await postRepo.save(post);

    return post;
};

export const getPosts = async () => {
    return await postRepo.find({
        relations: ["user", "user.profile"],
        order: { createdAt: "DESC" },
    });
};

export const getPostById = async (id: number) => {
    const post = await postRepo.findOne({
        where: { id },
        relations: ["user", "user.profile", "comments", "reactions"],
    });

    if (!post) {
        throw new AppError(
            "Post no encontrado",
            HttpStatus.NOT_FOUND,
            ErrorCode.NOT_FOUND,
        );
    }

    return post;
};

export const updatePost = async (
  userId: number,
  postId: number,
  data: UpdatePostDto
) => {
  const post = await postRepo.findOne({
    where: { id: postId },
    relations: ["user"],
  });

  if (!post) {
    throw new AppError("Post no encontrado", HttpStatus.NOT_FOUND);
  }

  if (post.user.id !== userId) {
    throw new AppError("No autorizado", HttpStatus.FORBIDDEN);
  }

  // 🔥 validación extra (pro)
  if (!data.content && !data.visibility) {
    throw new AppError("Nada para actualizar", HttpStatus.BAD_REQUEST);
  }

  post.content = data.content ?? post.content;
  post.visibility = data.visibility ?? post.visibility;

  await postRepo.save(post);

  return post;
};
// ✅ DELETE
export const deletePost = async (userId: number, postId: number) => {
    const post = await postRepo.findOne({
        where: { id: postId },
        relations: ["user"],
    });

    if (!post) {
        throw new AppError("Post no encontrado", HttpStatus.NOT_FOUND);
    }

    if (post.user.id !== userId) {
        throw new AppError("No autorizado", HttpStatus.FORBIDDEN);
    }

    await postRepo.remove(post);

    return { deleted: true };
};

export const getMyPosts = async (userId: number) => {
    const posts = await postRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: "DESC" },
        relations: ["user"],
    });

    return posts;
};

export const updatePostVisibility = async (
    postId: number,
    userId: number,
    visibility: "public" | "friends" | "private",
) => {
    const post = await postRepo.findOne({
        where: { id: postId },
        relations: ["user"],
    });

    if (!post) {
        throw new AppError("Post no encontrado", HttpStatus.NOT_FOUND);
    }

    if (post.user.id !== userId) {
        throw new AppError("No autorizado", HttpStatus.FORBIDDEN);
    }

    post.visibility = visibility;

    await postRepo.save(post);

    return post;
};
