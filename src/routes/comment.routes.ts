import { Router, Request, Response } from "express";
import { CommentModel } from "../models/Comment.model.js";

const router = Router();

// Создать комментарий
router.post("/", async (req: Request, res: Response) => {
    try {
        const { post, author, parentComment, mentions, text, images } = req.body;
        const newComment = new CommentModel({ post, author, parentComment, mentions, text, images });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ error: "Ошибка при создании комментария" });
    }
});

// Получить комментарии по postId
router.get("/post/:postId", async (req: Request, res: Response) => {
    try {
        const comments = await CommentModel.find({ post: req.params.postId })
            .populate("author")
            .populate("mentions")
            .populate("parentComment");
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить количество комментариев по postId
router.get("/post/:postId/count", async (req: Request, res: Response) => {
    try {
        const count = await CommentModel.countDocuments({ post: req.params.postId });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удалить комментарий по id
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const deletedComment = await CommentModel.findByIdAndDelete(req.params.id);
        if (!deletedComment) return res.status(404).json({ error: "Комментарий не найден" });
        res.json({ message: "Комментарий удалён" });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

export default router;