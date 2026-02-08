import QuestionRepository from '../repositories/questionRepository.mjs';

const QuestionService = {
    createQuestion: async (title, description, category) => {
        return await QuestionRepository.createQuestion(title, description, category);
    },
    getQuestions: async () => {
        return await QuestionRepository.getQuestions();
    },
    searchQuestions: async (title, category) => {
        return await QuestionRepository.searchQuestions(title, category);
    },
    getQuestionById: async (questionId) => {
        return await QuestionRepository.getQuestionById(questionId);
    },
    updateQuestion: async (questionId, title, description, category) => {
        return await QuestionRepository.updateQuestion(questionId, title, description, category);
    },
    deleteQuestion: async (questionId) => {
        return await QuestionRepository.deleteQuestion(questionId);
    },
    createAnswer: async (questionId, content) => {
        return await QuestionRepository.createAnswer(questionId, content);
    },
    getAnswers: async (questionId) => {
        return await QuestionRepository.getAnswers(questionId);
    },
    deleteAnswer: async (questionId) => {
        return await QuestionRepository.deleteAnswer(questionId);
    },
}

export default QuestionService;