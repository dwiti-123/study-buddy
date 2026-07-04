import axios from "axios";

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/quiz` || "http://localhost:3000/api/quiz";

// Always include cookies for auth
axios.defaults.withCredentials = true;

export const submitQuizAttempt = async (payload: {
  quizResourceId: string;
  answers: {
    question: string;
    type: string;
    selectedAnswer: string;
    correctAnswer: string;
  }[];
}) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/submit`,
      payload,
      { withCredentials: true }
    );

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      "Quiz submission failed";

    throw new Error(message);
  }
};