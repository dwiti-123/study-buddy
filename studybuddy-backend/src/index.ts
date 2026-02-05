import express from "express";
import ConnectDB from "./db/connection";
import cors from "cors";
import authRouter from "./routes/auth";
import { protect } from "./middleware/protect";
import resourceRouter from "./routes/resource";
import quizRouter from "./routes/quiz";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
//  CORS setup
app.use(
  cors({
    origin: "http://localhost:3001", // your frontend URL
    credentials: true, // needed if you use cookies
  })
);


await ConnectDB();

// Mount your routers **before app.listen**
app.use("/api/auth", authRouter);
app.use("/api/resources",protect,  resourceRouter);
app.use("/api/quiz/",protect,quizRouter)

app.get('/', (req, res) => {
  res.json({ message: 'StudyBuddy Backend is running!!' });
});

app.listen(3000, () => {
  console.log("App running on 3000");
});

