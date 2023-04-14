import { Router } from "express";
import { getFileUrl } from "../controllers/imgUploader.controller";
import { upload } from "../configs/googleCloud.config";
const toolsRouter = Router();

toolsRouter.post("/uploadImg", upload.single("imgFile"), getFileUrl);
export { toolsRouter };