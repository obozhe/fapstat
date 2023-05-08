import { passwordRegex, usernameRegex } from 'helpers/regex';
import { z } from 'zod';

import { AuthenticationProps } from './enums';

export const signUpValidationSchema = z
    .object({
        [AuthenticationProps.Username]: z
            .string({ required_error: 'Username is required' })
            .min(1, 'Username is required')
            .max(30)
            .regex(usernameRegex, 'Valid characters in username are A-Z a-z 0-9 . _ -')
            .trim(),
        [AuthenticationProps.Email]: z.string({ required_error: 'Email is required' }).max(255).email('Invalid email'),
        [AuthenticationProps.Password]: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Must be at least 8 characters')
            .regex(passwordRegex, 'Must contain both letters and numbers')
            .max(255),
        [AuthenticationProps.PasswordConfirmation]: z
            .string({ required_error: 'Password confirmation is required' })
            .min(8, 'Must be at least 8 characters')
            .regex(passwordRegex, 'Must contain both letters and numbers')
            .max(255),
        [AuthenticationProps.FirstName]: z
            .string({ required_error: 'First name is required' })
            .min(2, 'Must be at least 2 characters')
            .max(255),
        [AuthenticationProps.LastName]: z
            .string({ required_error: 'Last name is required' })
            .min(2, 'Must be at least 2 characters')
            .max(255),
        [AuthenticationProps.Timezone]: z.string(),
        [AuthenticationProps.Avatar]: z.object({ color: z.string(), emoji: z.string() }),
    })
    .refine((data) => data[AuthenticationProps.Password] === data[AuthenticationProps.PasswordConfirmation], {
        message: "Passwords don't match",
        path: [AuthenticationProps.PasswordConfirmation],
    });

export type SignUpFormData = z.infer<typeof signUpValidationSchema>;
