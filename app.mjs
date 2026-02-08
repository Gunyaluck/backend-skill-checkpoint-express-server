import 'dotenv/config';

import express from "express";
import QuestionRouter from './routes/questionRoute.mjs';
import AnswerRouter from './routes/answerRoute.mjs';

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", QuestionRouter.CreateRoute());
// app.use("/answers", AnswerRouter.CreateRoute());

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});