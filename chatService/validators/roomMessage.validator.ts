import { z } from "zod";

export const roomMessageSchema = z.object({
    content:z.string().min(1),
    sender:z.string(),
    room:z.string(),
}).strict();