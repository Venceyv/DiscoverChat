import { z } from 'zod';

const zodGenders = z.custom((val) => {
  if (val === 'female' || val === 'male' || val === 'other' || val === '') {
    return z.string();
  }
});

const userSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    birthday: z.date().nullish().optional(),
    profilePic: z.string().url().optional(),
    majorList: z.array(z.string()).optional(),
    description: z.string().min(4).max(500).optional(),
    gender: zodGenders.optional(),
    createdAt: z.date().nullish().optional(),
    upadatedAt: z.date().nullish().optional(),
  })
  .strict();

export { userSchema };
