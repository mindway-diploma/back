import { Router, Request, Response } from "express";
import { PostModel } from "../models/Post.model.js";
import multer from "multer";
import uploadManyToS3 from "../middlewares/uploadManyToS3.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Получить все посты
router.get("/", async (req: Request, res: Response) => {
    try {
        const { topic } = req.query;
        let filter = {};
        if (topic) {
            filter = { topic };
        }
        const posts = await PostModel.find(filter).sort({createdAt: -1}).populate("creator");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить пост по id
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const post = await PostModel.findById(req.params.id).populate("creator");
        if (!post) return res.status(404).json({ error: "Пост не найден" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить посты по userId
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        console.log(req.params.userId);
        const posts = await PostModel.find({ creator: req.params.userId }).populate("creator");
        console.log(posts)
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Создать новый пост
router.post(
    "/",
    verifyJWT,
    uploadManyToS3,
    async (req: any, res: Response) => {
        try {
            const creator = req.id; // Получаем ID пользователя из токена
            const { content, topic } = req.body;
            console.log(content, creator, topic);
            const images = req.imagesUrls || [];
            console.log(images);
            const newPost = new PostModel({ content, images, creator, topic });
            await newPost.save();
            res.status(201).json(newPost);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "Ошибка при создании поста" });
        }
    }
);

// Обновить пост
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ error: "Пост не найден" });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: "Ошибка при обновлении поста" });
    }
});

// Удалить пост
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ error: "Пост не найден" });
        res.json({ message: "Пост удалён" });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

export default router;