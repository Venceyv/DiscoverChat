import { Router } from "express";
import { getLoginForm, loginUser } from "../controllers/login.contoller";
const loginUserRouter = Router();

loginUserRouter.get('/',loginUser);
loginUserRouter.get("/form", getLoginForm);

export { loginUserRouter };