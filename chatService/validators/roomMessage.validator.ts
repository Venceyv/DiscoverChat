/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-13 01:37:03
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-19 22:15:32
 * @FilePath: \discoveryChat\validators\roomMessage.validator.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { z } from "zod";

export const roomMessageSchema = z.object({
    content:z.string().min(1),
    sender:z.string(),
    room:z.string(),
}).strict();
