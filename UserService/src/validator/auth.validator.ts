import { z } from 'zod';

const emailSchema = z.string().email().min(3);

export default { emailSchema };
