import QuestionService from '../services/questionService.mjs';


const QuestionController = {
    createQuestion: async (req, res) => {
        try {
            const { title, description, category } = req.body;
            const question = await QuestionService.createQuestion(title, description, category);
            res.status(201).json({ "message": "Question created successfully.", "question": question });
        } catch (error) {
            res.status(500).json({ "message": "Unable to create question." });
        }
    },
    getQuestions: async (req, res) => {
        try {
            const questions = await QuestionService.getQuestions();
            res.status(200).json({data: questions});
        } catch (error) {
            res.status(500).json({ "message": "Unable to fetch questions." });
        }
    },
    searchQuestions: async (req, res) => {
        try {
            const { title, category } = req.query;
            const questions = await QuestionService.searchQuestions(title, category);
            res.status(200).json({data: questions});
        } catch (error) {
            res.status(500).json({ "message": "Unable to search questions." });
        }
    },
    getQuestionById: async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await QuestionService.getQuestionById(questionId);
            res.status(200).json({ data: question });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }
    
            res.status(500).json({ message: "Unable to fetch question." });
        }
    },
    updateQuestion: async (req, res) => {
        try {
            const { questionId } = req.params;
            const { title, description, category } = req.body;
            const question = await QuestionService.updateQuestion(questionId, title, description, category);
            res.status(200).json({ "message": "Question updated successfully.", data: question });
        } catch (error) {
            res.status(500).json({ "message": "Unable to update question." });
        }
    },
    deleteQuestion: async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await QuestionService.deleteQuestion(questionId);
            res.status(200).json({ "message": "Question and answers deleted successfully." });
        } catch (error) {
            res.status(500).json({ "message": "Unable to delete question." });
        }
    },
    createAnswer: async (req, res) => {
        try {
            const { questionId } = req.params;
            const { content } = req.body;
            const answer = await QuestionService.createAnswer(questionId, content);
            res.status(201).json({ "message": "Answer created successfully.", data: answer });
        } catch (error) {
            res.status(500).json({ "message": "Unable to create answer." });
        }
    },
    getAnswers: async (req, res) => {
        try {
            const { questionId } = req.params;
            const answers = await QuestionService.getAnswers(questionId);
            res.status(200).json({data: answers});
        } catch (error) {
            res.status(500).json({ "message": "Unable to fetch answers." });
        }
    },
    deleteAnswer: async (req, res) => {
        try {
            const { questionId } = req.params;
            const answer = await QuestionService.deleteAnswer(questionId);
            res.status(200).json({ "message": "All answers for this question have been deleted successfully." });
        } catch (error) {
            res.status(500).json({ "message": "Unable to delete answer." });
        }
    },
}

export default QuestionController;