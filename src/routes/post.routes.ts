import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, postController.getMyPosts);
router.post("/", authMiddleware, postController.create);
router.get("/", authMiddleware, postController.getAll);
router.get("/:id", authMiddleware, postController.getOne);
router.put("/:id", authMiddleware, postController.update);
router.delete("/:id", authMiddleware, postController.remove);
router.patch(
    "/:id/visibility",
    authMiddleware,
    postController.updateVisibility,
);

export default router;
