import { zodResolver } from '@hookform/resolvers/zod';
import BlockLoader from '@ui/BlockLoader';
import Button from '@ui/Button';
import Input from '@ui/Input';
import { PasswordField } from '@ui/PasswordField';
import { UserDto } from 'core/types/userDto';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import AuthApi, { AuthURL } from '../../api/AuthApi';
import { SignInFormData, signInValidationSchema } from '../../types/SignInFormData';
import { AuthenticationProps } from '../../types/enums';

const SignInForm = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { trigger, isMutating: isSubmitting } = useFetchLazy<UserDto, SignInFormData>(
        AuthURL.signIn,
        AuthApi.signIn,
        {
            onSuccess: (user) => {
                setUser(user);
                navigate('/', { replace: true });
            },
        }
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInValidationSchema),
        defaultValues: {
            [AuthenticationProps.Timezone]: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    });

    const login: SubmitHandler<SignInFormData> = (data) => trigger(data);

    return (
        <BlockLoader isLoading={isSubmitting}>
            <form onSubmit={handleSubmit(login)} className="grid">
                <Input
                    label="Username or Email"
                    error={errors[AuthenticationProps.Username]?.message}
                    {...register(AuthenticationProps.Username)}
                />

                <PasswordField
                    label="Password"
                    error={errors[AuthenticationProps.Password]?.message}
                    {...register(AuthenticationProps.Password)}
                />
                <Button color="primary" size="lg" type="submit" disabled={isSubmitting} fullWidth>
                    login
                </Button>
            </form>
        </BlockLoader>
    );
};

export default SignInForm;
