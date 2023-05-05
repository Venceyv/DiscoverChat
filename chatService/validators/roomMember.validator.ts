import { z } from "zod";

export const roomMemberSchema = z.object({
    user:z.string(),
    room:z.string()
}).strict();