import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// Get messages of a thread
router.get("/thread/:threadId", async (req, res) => {
    try {
        const thread = await Thread.findOne({ threadId: req.params.threadId });
        if (!thread) return res.status(404).json([]);
        res.json(thread.messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// Delete thread
router.delete("/thread/:threadId", async (req, res) => {
    try {
        await Thread.findOneAndDelete({ threadId: req.params.threadId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Chat endpoint
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.slice(0, 30),
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();
        await thread.save(); //

        res.json({ reply: assistantReply }); 

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Chat failed" });
    }
});

export default router;
