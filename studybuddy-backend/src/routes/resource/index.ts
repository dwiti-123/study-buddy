import express from "express";
import { generateStudyResource,getUserStudyResources,getStudyResourceById } from "../../controller/studyResource";
import  {protect}  from "../../middleware/protect"; 

const resourceRouter = express.Router();

// Only authenticated users can access
resourceRouter.post("/generate", generateStudyResource);
resourceRouter.get("/", protect, getUserStudyResources); //  new route
resourceRouter.get("/:id", protect, getStudyResourceById); //  for single resource view
export default resourceRouter;