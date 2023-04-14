/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:53:11
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-12 23:31:23
 * @FilePath: \discoveryChat(ts)\controllers\imgUploader.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {uploadFile} from '../services/processIMG.service';
import { Request,Response } from "express";
export const getFileUrl = function (req:Request,res:Response)
{
    const fileUrl = uploadFile(req);
    if(fileUrl)
    {
        res.status(200).json(fileUrl);
    }
}