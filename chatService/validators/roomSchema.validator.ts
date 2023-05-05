/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-13 01:13:08
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 01:56:13
 * @FilePath: \discoveryChat\validators\groupSchema.validator.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { z } from "zod";

export const roomSchema = z.object({
    avatar:z.string(),
    name:z.string().min(1),
}).strict();

export const messageContent = z.string().min(1);