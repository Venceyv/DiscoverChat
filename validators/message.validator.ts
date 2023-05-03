import z from "zod";
export const messageContent = z.string().min(1);