import { Router, Request, Response } from "express";
import { LikeModel } from "../models/Like.model.js";
import verifyJWT from "../middlewares/verifyJWT.js";
// import verifyJWT from "../middleware/verifyJWT"; // Раскомментируйте если есть middleware

const router = Router();

// Поставить/убрать лайк
router.post("/", verifyJWT, async (req: Request, res: Response) => {
    try {
        const user = (req as any).id;
        const { objectId, objectType } = req.body;
        
        const existing = await LikeModel.findOne({ objectId, objectType, user });
        console.log(existing);
        if (existing) {
            await existing.deleteOne();
            // return res.json({ liked: false });
            const likesCount = await LikeModel.countDocuments({ objectId, objectType });
            return res.status(200).json({ success: true, message: "Like removed", likesCount });
        } else {
            const like = new LikeModel({ objectId, objectType, user });
            console.log(like);
            await like.save();
            const likesCount = await LikeModel.countDocuments({ objectId, objectType });

            res.status(201).json({ success: true, like, likesCount });
            // return res.json({ liked: true });
        }
    } catch (err) {
        res.status(400).json({ error: "Ошибка при обработке лайка" });
    }
});

// Получить количество лайков
router.get("/:objectId/:objectType/amount", async (req: Request, res: Response) => {
    try {
        const { objectId, objectType } = req.params;
        const likesCount = await LikeModel.countDocuments({ objectId, objectType });
        res.status(200).json({ success: true, likesCount });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить лайки по объекту
router.get("/:objectId/:objectType", async (req: Request, res: Response) => {
    try {
        const { objectId, objectType } = req.params;
        const likes = await LikeModel.find({ objectId, objectType });
        res.json(likes);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Проверить, поставил ли пользователь лайк
router.get("/:objectId/:objectType/is-liked", verifyJWT, async (req: Request, res: Response) => {
    try {
        const user = (req as any).id; // user id должен приходить в query или быть в req.user
        const { objectId, objectType } = req.params;
        // const { user } = req.query; // user id должен приходить в query или быть в req.user
        if (!user) return res.status(400).json({ error: "user обязателен" });
        const isLiked = await LikeModel.exists({ objectId, objectType, user });
        res.json({ isLiked: isLiked ? true : false });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

export default router;