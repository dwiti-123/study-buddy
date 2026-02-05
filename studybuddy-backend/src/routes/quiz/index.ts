import express from "express";
import { protect } from "../../middleware/protect";
import { submitQuiz } from "../../controller/submitQuiz";


const quizRouter = express.Router();

// Submit quiz attempt
quizRouter.post("/submit", protect, submitQuiz);

export default quizRouter;
