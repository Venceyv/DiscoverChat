import { Request, Response } from "express";
import { globalLogger } from "../configs/logger.config";
import { LoginForm } from "../interfaces/loginForm.interface";
import { getLoginFormJson } from "../services/login.service";

export const getLoginForm = async (req: Request, res: Response) => {
  try {
    const loginForm: LoginForm = getLoginFormJson("../login");
    return res.status(200).json(loginForm);
  } catch (error) {
    globalLogger.error(error);
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies.userName;
    if (cookie == undefined) {
        const userName = req.query.username;
        res.cookie("userName", userName, { maxAge: 900000, httpOnly: true })
    };
    console.log(req.cookies.userName);
    res.redirect(`../chatList/page`);
  } catch (error) {
    globalLogger.error(error);
  }
};
