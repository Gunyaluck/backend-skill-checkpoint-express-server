import { Router } from "express";
import connectionPool from '../utils/db.mjs';

const questionRouter = Router();

// ผู้ใช้งานสามารถสร้างคำถามได้ มี title, description, category กำกับ
questionRouter.post("/", async (req, res) => {
    const { title, description, category } = req.body;
    try {
        if (!title || !description || !category) {
            return res.status(400).json({ "message": "Invalid request data." });
        }
        await connectionPool.query(
            "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *",
            [title, description, category]
        );
        return res.status(201).json({
            "message": "Question created successfully.",
        });
    } catch (error) {
        return res.status(500).json({ "message": "Unable to create question." });
    }
});

// ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
questionRouter.get("/", async (req, res) => {
    try {
        const result = await connectionPool.query("SELECT * FROM questions");
        return res.status(200).json({
            "data": result.rows
        });
    } catch (error) {
        return res.status(500).json({ "message": "Unable to fetch questions." });
    }
});

// ผู้ใช้งานสามารถที่จะค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
// route แบบคงที่ (static) >> /search ต้องถูกประกาศก่อน route ที่เป็นพารามิเตอร์ (dynamic) >> /:questionId    
questionRouter.get("/search", async (req, res) => {
    const { title, category } = req.query;

    try {
        if (!title && !category) {
            return res.status(400).json({"message": "Invalid search parameters."});
        }

        let query = "SELECT * FROM questions WHERE 1=1"; // 1=1 เป็น true >>ถ้าไม่มี title หรือ category จะ return ทั้งหมด
        const values = [];

        if (title) {
            values.push(`%${title}%`); // %${title}% เป็น wildcard ที่จะค้นหาคำถามที่มี title ที่คล้ายกับ title ที่กรอกเข้าไป
            query += ` AND title ILIKE $${values.length}`;
        }

        if (category) {
            values.push(`%${category}%`);
            query += ` AND category ILIKE $${values.length}`;
        }

        const result = await connectionPool.query(query, values);

        return res.status(200).json({ data: result.rows });

    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch a question." });
    }
});


// ผู้ใช้งานสามารถที่จะดูคำถามโดย id ได้
questionRouter.get("/:questionId", async (req, res) => {
    const { questionId } = req.params;
    try {
        const result = await connectionPool.query("SELECT * FROM questions WHERE questions.id = $1", [questionId]);
        // ถ้าไม่พบคำถาม
        if (result.rows.length === 0) {
            return res.status(404).json({ "message": "Question not found." });
        }
        return res.status(200).json({
            "data": result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({ "message": "Unable to fetch question." });
    }
});

// ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
questionRouter.put("/:questionId", async (req, res) => {
    const { questionId } = req.params;
    const { title, description, category } = req.body;
    try {
        // ถ้าข้อมูลไม่ครบ
        if (!title || !description || !category) {
            return res.status(400).json({ "message": "Invalid request data." });
        }

        const result = await connectionPool.query("UPDATE questions SET title = $1, description = $2, category = $3 WHERE questions.id = $4 RETURNING *", [title, description, category, questionId]);

        // ถ้าไม่ข้อมูลของคำถาม
        if (result.rows.length === 0) {
            return res.status(404).json({ "message": "Question not found." });
        }

        return res.status(200).json({ "message": "Question updated successfully." });
    } catch (error) {
        return res.status(500).json({ "message": "Unable to update question." });
    }
});

// ผู้ใช้งานสามารถที่จะลบคำถามได้
questionRouter.delete("/:questionId", async (req, res) => {
    const { questionId } = req.params;
    try {
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        await connectionPool.query("DELETE FROM questions WHERE questions.id = $1", [questionId]);
        return res.status(200).json({ "message": "Question post has been deleted successfully." });
    } catch (error) {
        return res.status(500).json({ "message": "Unable to delete question." });
    }
});

//ผู้ใช้งานสามารถสร้างคำตอบของคำถามนั้นได้ ข้อความยาวๆ ไม่เกิน 300 ตัวอักษร
questionRouter.post("/:questionId/answers", async (req, res) => {
    const { questionId } = req.params;
    const { content } = req.body;
    try {
        // ถ้าข้อมูลไม่ครบ
        if (!content || content.length > 300) {
            return res.status(400).json({ "message": "Invalid request data." });
        }
        // ถ้าไม่พบ id ของคำถาม
        const question = await connectionPool.query("SELECT * FROM questions WHERE questions.id = $1", [questionId]);
        if (question.rows.length === 0) {
            return res.status(404).json({ message: "Question not found." });
        }
        await connectionPool.query("INSERT INTO answers (question_id, content) VALUES ($1, $2)", [questionId, content]);
        return res.status(201).json({ "message": "Answer created successfully." });
    }
    catch (error) {
        return res.status(500).json({ "message": "Unable to create answer." });
    }
});

//ผู้ใช้งานสามารถที่จะดูคำตอบของคำถามแต่ละอันได้
questionRouter.get("/:questionId/answers", async (req, res) => {
    const { questionId } = req.params;
    try {
        const result = await connectionPool.query("SELECT * FROM answers WHERE answers.question_id = $1", [questionId]);
        // ถ้าไม่พบ id ของคำถาม
        if (result.rows.length === 0) {
            return res.status(404).json({"message": "Question not found."});
        }
        return res.status(200).json({ "data": result.rows });
    }
    catch (error) {
        return res.status(500).json({ "message": "Unable to fetch answers." });
    }
});

//ผู้ใช้งานสามารถที่จะลบคำถามได้ ลบคำถามออก คำตอบก็จะถูกลบตามคำถามนั้นๆ ไปด้วย
questionRouter.delete("/:questionId/answers", async (req, res) => {
    const { questionId } = req.params;
    try {
        const question = await connectionPool.query("SELECT * FROM questions WHERE questions.id = $1", [questionId]);
        if (question.rows.length === 0) {
            return res.status(404).json({ "message": "Question not found." });
        }
        await connectionPool.query("DELETE FROM answers WHERE answers.question_id = $1", [questionId]);
        return res.status(200).json({"message": "All answers for the question have been deleted successfully."});
    }
    catch (error) {
        return res.status(500).json({ "message": "Unable to delete answers." });
    }
});

export default questionRouter;