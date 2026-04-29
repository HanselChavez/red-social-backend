import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";
import { validateIdParam } from "../middleware/validateId.middleware";

const router = Router();

router.post(
    "/create-user",
    authMiddleware,
    adminMiddleware,
    userController.create,
);
router.get("/", authMiddleware, adminMiddleware, userController.getAll);
router.get("/:id", authMiddleware, validateIdParam(), userController.getById);
router.put("/:id", authMiddleware, validateIdParam(), userController.update);
router.delete("/:id", authMiddleware, validateIdParam(), userController.remove);

export default router;
