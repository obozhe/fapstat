import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@ui/Button';
import { PasswordField } from '@ui/PasswordField';
import { passwordRegex } from 'helpers/regex';
import { AuthenticationProps } from 'modules/Auth/types/enums';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const validationSchema = z
    .object({
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
    })
    .refine((data) => data[AuthenticationProps.Password] === data[AuthenticationProps.PasswordConfirmation], {
        message: "Passwords don't match",
        path: [AuthenticationProps.PasswordConfirmation],
    });

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
    onSubmit: (password: string) => void;
};

const UpdatePasswordForm = ({ onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
        mode: 'onBlur',
    });

    const submit: SubmitHandler<ValidationSchema> = (data) => {
        onSubmit(data[AuthenticationProps.Password]);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="grid">
            <PasswordField
                label="Password"
                error={errors[AuthenticationProps.Password]?.message}
                {...register(AuthenticationProps.Password)}
            />
            <PasswordField
                label="Confirm Password"
                error={errors[AuthenticationProps.PasswordConfirmation]?.message}
                {...register(AuthenticationProps.PasswordConfirmation)}
            />

            <Button color="primary" size="lg" type="submit" fullWidth>
                update password
            </Button>
        </form>
    );
};

export default UpdatePasswordForm;
