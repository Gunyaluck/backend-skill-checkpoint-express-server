const QuestionValidation = {
    createQuestion: (req, res, next) => {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({ "message": "Invalid request data." });
    }
    next();
},
    updateQuestion: (req, res, next) => {
        const { questionId } = req.params;
        const { title, description, category } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ "message": "Invalid request data." });
        }
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        next();
    },
    searchQuestions: (req, res, next) => {
        const { title, category } = req.query;
        if (!title && !category) {
            return res.status(400).json({"message": "Invalid search parameters."});
        }
        next();
    },
    deleteQuestion: (req, res, next) => {
        const { questionId } = req.params;
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        next();
    },
    getQuestionById: (req, res, next) => {
        const { questionId } = req.params;
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        next();
    },
    createAnswer: (req, res, next) => {
        const { questionId } = req.params;
        const { content } = req.body;
        if (!content || content.length > 300) {
            return res.status(400).json({ "message": "Invalid request data." });
        }
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        next();
    },

    getAnswers: (req, res, next) => {
        const { questionId } = req.params;
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        next();
    },

    deleteAnswer: (req, res, next) => {
        const { questionId } = req.params;
        if (!questionId) {
            return res.status(404).json({ "message": "Question not found." });
        }
        next();
    },
};

export default QuestionValidation;