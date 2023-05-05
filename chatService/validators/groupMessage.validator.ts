import { z } from "zod";

export const groupMessageSchema = z.object({
    content:z.string().min(1),
    sender:z.string(),
    group:z.string(),
}).strict();
