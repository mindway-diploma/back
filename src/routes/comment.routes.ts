import { Router, Request, Response } from "express";
import { CommentModel } from "../models/Comment.model.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import { ObjectId } from "mongoose";

const router = Router();

// Создать комментарий
router.post("/", verifyJWT, async (req: any, res: Response) => {
    try {
        const { post, author, parentCommentId, mentions, text } = req.body;
        const userId = req.id;
        console.log("create comment", req.body);
        const newComment = await CommentModel.create({ post, author: userId, parentComment: parentCommentId || null, mentions, text });
        res.status(201).json(newComment);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Ошибка при создании комментария" });
    }
});

async function getReplies(parentCommentId: string | ObjectId) {
    const replies = await CommentModel.find({ parentComment: parentCommentId })
          .populate("author", "name surname avatar")
          .populate("mentions", "name surname")
          .lean();

        for (const reply of replies) {
          reply.replies = await getReplies(reply._id as string);
        }
      
        return replies;
}
// Получить комментарии по postId
router.get("/post/:postId", async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const comments = await CommentModel.find({ post: postId, parentComment: null })
            .sort({createdAt: -1})
            .populate("author", "name surname avatar")
            .populate("mentions", "name surname")
            .lean();

        for (const comment of comments) {
            comment.replies = await getReplies(comment._id as string);
        }

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить количество комментариев по postId
router.get("/post/:postId/count", async (req: Request, res: Response) => {
    try {
        console.log("INSIDE")
        console.log(req.params.postId)
        const commentsCount = await CommentModel.countDocuments({ post: req.params.postId });
        console.log(commentsCount);
        res.json({ commentsCount });
    } catch (err) {
        console.log(err);
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