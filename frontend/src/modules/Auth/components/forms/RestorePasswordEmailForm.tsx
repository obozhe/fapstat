import { zodResolver } from '@hookform/resolvers/zod';
import BlockLoader from '@ui/BlockLoader';
import Button from '@ui/Button';
import Input from '@ui/Input';
import UsersApi, { UsersURL } from 'core/services/UsersApi';
import useFetchLazy from 'hooks/useFetchLazy';
import { AuthenticationProps } from 'modules/Auth/types/enums';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const validationSchema = z.object({
    [AuthenticationProps.Email]: z.string({ required_error: 'Email is required' }).max(255).email('Invalid email'),
});

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
    onSubmit: (userId: string) => void;
};
const RestorePasswordEmailForm = ({ onSubmit }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { trigger } = useFetchLazy<string, string>(UsersURL.getUserId, UsersApi.getUserIdByEmail);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
        mode: 'onBlur',
    });

    const getUserId = (formData: ValidationSchema) => {
        if (isValid) {
            setIsSubmitting(true);
            trigger(formData[AuthenticationProps.Email])
                .then((userId) => userId && onSubmit(userId))
                .finally(() => setIsSubmitting(false));
        }
    };

    return (
        <BlockLoader isLoading={isSubmitting}>
            <form onSubmit={handleSubmit(getUserId)} className="grid">
                <Input
                    label="Email"
                    error={errors[AuthenticationProps.Email]?.message}
                    {...register(AuthenticationProps.Email)}
                />

                <Button color="primary" size="lg" type="submit" disabled={isSubmitting} fullWidth>
                    next
                </Button>
            </form>
        </BlockLoader>
    );
};

export default RestorePasswordEmailForm;
