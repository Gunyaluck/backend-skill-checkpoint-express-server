import { Router } from "express";
import QuestionValidation from '../middlewares/questionValidation.mjs';
import QuestionController from '../controllers/questionController.mjs';


const QuestionRouter = {
    CreateRoute: () => {
        const questionRouter = Router();
        questionRouter.post("/", QuestionValidation.createQuestion, QuestionController.createQuestion);
        questionRouter.get("/", QuestionController.getQuestions);
        questionRouter.get("/search", QuestionValidation.searchQuestions, QuestionController.searchQuestions);
        questionRouter.get("/:questionId", QuestionValidation.getQuestionById, QuestionController.getQuestionById);
        questionRouter.put("/:questionId", QuestionValidation.updateQuestion, QuestionController.updateQuestion);
        questionRouter.delete("/:questionId", QuestionValidation.deleteQuestion, QuestionController.deleteQuestion);
        questionRouter.post("/:questionId/answers", QuestionValidation.createAnswer, QuestionController.createAnswer);
        questionRouter.get("/:questionId/answers", QuestionValidation.getAnswers, QuestionController.getAnswers);
        questionRouter.delete("/:questionId/answers", QuestionValidation.deleteAnswer, QuestionController.deleteAnswer);

        return questionRouter;
    },
}

export default QuestionRouter;