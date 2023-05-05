import { z } from "zod";

export const groupMessageSchema = z.object({
    content:z.string().min(1),
    sender:z.string(),
    group:z.string(),
}).strict();
<<<<<<< HEAD
=======

export const messageContent = z.string().min(1);
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
