import connectionPool from '../utils/db.mjs';

const QuestionRepository = {
    // ผู้ใช้งานสามารถสร้างคำถามได้ มี title, description, category กำกับ
    createQuestion: async (title, description, category) => {
        try {
            const result = await connectionPool.query("INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *", [title, description, category]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    // ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
    getQuestions: async () => {
        try {
            const result = await connectionPool.query("SELECT * FROM questions");
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    // ผู้ใช้งานสามารถที่จะค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
    // route แบบคงที่ (static) >> /search ต้องถูกประกาศก่อน route ที่เป็นพารามิเตอร์ (dynamic) >> /:questionId  
    searchQuestions: async (title, category) => {
        try {
            if (!title && !category) {
                throw new Error("Invalid search parameters.");
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

            return result.rows;

        } catch (error) {
            throw error;
        }
    },

    // ผู้ใช้งานสามารถที่จะดูคำถามโดย id ได้
    getQuestionById: async (questionId) => {
        try {
            const result = await connectionPool.query("SELECT * FROM questions WHERE id = $1", [questionId]);
            if (result.rows.length === 0) {
                throw new Error("Question not found.");
            }
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    // ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
    updateQuestion: async (questionId, title, description, category) => {
        try {
            // ถ้าข้อมูลไม่ครบ
            if (!title || !description || !category) {
                throw new Error("Invalid request data.");
            }

            const result = await connectionPool.query("UPDATE questions SET title = $1, description = $2, category = $3 WHERE questions.id = $4 RETURNING *", [title, description, category, questionId]);

            // ถ้าไม่ข้อมูลของคำถาม
            if (result.rows.length === 0) {
                throw new Error("Question not found.");
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    // ผู้ใช้งานสามารถที่จะลบคำถามได้ ลบคำถามออก คำตอบก็จะถูกลบตามคำถามนั้นๆ ไปด้วย
    deleteQuestion: async (questionId) => {
        try {
            const result = await connectionPool.query(
                "DELETE FROM questions WHERE id = $1",
                [questionId] // จากตาราง answers.question_id = question.id เมื่อลบคำถามออก จะลบคำตอบออกด้วย
            );

            if (result.rowCount === 0) {
                throw new Error("Question not found.");
            }

            return { deleted: true };
        } catch (error) {
            throw error;
        }
    },
    // ใช้ transaction ในการลบคำถามออก คำตอบก็จะถูกลบตามคำถามนั้นๆ ไปด้วย
    //     try {
    //         await connectionPool.query("BEGIN"); // เริ่ม transaction
    //         await connectionPool.query("DELETE FROM answers WHERE answers.question_id = $1", [questionId]);
    //         await connectionPool.query("DELETE FROM questions WHERE questions.id = $1", [questionId]);
    //         if (result.rowCount === 0) {
    //             await connectionPool.query("ROLLBACK"); // ยกเลิก transaction
    //             return res.status(404).json({ "message": "Question not found." });
    //         }
    //         await connectionPool.query("COMMIT"); // ยืนยัน transaction
    //         return res.status(200).json({ "message": "Question and answers have been deleted successfully." });
    //     } catch (error) {
    //         await connectionPool.query("ROLLBACK"); // ยกเลิก transaction
    //         return res.status(500).json({ "message": "Unable to delete question." });
    //     }
    // });

    // ผู้ใช้งานสามารถสร้างคำตอบของคำถามนั้นได้ ข้อความยาวๆ ไม่เกิน 300 ตัวอักษร
    createAnswer: async (questionId, content) => {
        try {
            // ถ้าข้อมูลไม่ครบ
            if (!content || content.length > 300) {
                throw new Error("Invalid request data.");
            }
            // ถ้าไม่พบ id ของคำถาม
            const question = await connectionPool.query("SELECT * FROM questions WHERE questions.id = $1", [questionId]);
            if (question.rows.length === 0) {
                throw new Error("Question not found.");
            }
            const result = await connectionPool.query("INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *", [questionId, content]);
            return result.rows[0];
        }
        catch (error) {
            throw error;
        }
    },
    // ผู้ใช้งานสามารถที่จะดูคำตอบของคำถามแต่ละอันได้
    getAnswers: async (questionId) => {
        try {
            const questionCheck = await connectionPool.query("SELECT id FROM questions WHERE id = $1", [questionId]);
            if (questionCheck.rows.length === 0) {
                throw new Error("Question not found.");
            }
            const result = await connectionPool.query("SELECT * FROM answers WHERE answers.question_id = $1", [questionId]);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
    },

    // ผู้ใช้งานสามารถที่จะลบคำตอบออก 
    deleteAnswer: async (questionId) => {
        try {
            const result = await connectionPool.query("DELETE FROM answers WHERE answers.question_id = $1 RETURNING *", [questionId]);
            if (result.rowCount === 0) {
                throw new Error("Answer not found.");
            }
            return result.rows;
        }
        catch (error) {
            throw error;
        }
    },
}

export default QuestionRepository;