import { passwordRegex, usernameRegex } from 'helpers/regex';
import { z } from 'zod';

import { AuthenticationProps } from './enums';

export const signInValidationSchema = z.object({
    [AuthenticationProps.Username]: z
        .string({ required_error: 'Username or email is required' })
        .min(1, 'Username or email is required')
        .max(255)
        .refine((e) => {
            if (e.includes('@')) {
                const validator = z.string().email();
                const res = validator.safeParse(e);
                return res.success;
            }
            return true;
        }, 'Email is invalid')
        .refine((e) => {
            if (!e.includes('@')) {
                const validator = z.string().regex(usernameRegex);
                const res = validator.safeParse(e);
                return res.success;
            }
            return true;
        }, 'Valid characters in username are A-Z a-z 0-9 . _ -'),

    [AuthenticationProps.Password]: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Must be at least 8 characters')
        .regex(passwordRegex, 'Must contain both letters and numbers')
        .max(255),
    [AuthenticationProps.Timezone]: z.string(),
});

export type SignInFormData = z.infer<typeof signInValidationSchema>;
