import { z } from "zod";

export const groupMemberSchema = z.object({
    user:z.string(),
    group:z.string()
}).strict();