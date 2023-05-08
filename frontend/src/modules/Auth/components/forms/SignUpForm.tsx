import { zodResolver } from '@hookform/resolvers/zod';
import BlockLoader from '@ui/BlockLoader';
import Button from '@ui/Button';
import Input from '@ui/Input';
import { PasswordField } from '@ui/PasswordField';
import AvatarPicker from 'features/AvatarPicker';
import UsernameField, { UsernameCheckResult } from 'features/UsernameField';
import useFetchLazy from 'hooks/useFetchLazy';
import { SubmitHandler, useForm } from 'react-hook-form';

import AuthApi, { AuthURL } from '../../api/AuthApi';
import { SignUpFormData, signUpValidationSchema } from '../../types/SignUpFormData';
import { AuthenticationProps } from '../../types/enums';

type Props = {
    onRegister: (userId: string) => void;
};

const SignUpForm = ({ onRegister }: Props) => {
    const { trigger, isMutating: isSubmitting } = useFetchLazy<string, SignUpFormData>(AuthURL.signUp, AuthApi.signUp, {
        onSuccess: (userId) => onRegister(userId),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpValidationSchema),
        defaultValues: {
            [AuthenticationProps.Avatar]: { emoji: '1f423', color: '#000' },
            [AuthenticationProps.Timezone]: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    });

    const handleUsername = ({ username, isAvailable, isLoading }: UsernameCheckResult) => {
        if (!username) return;

        if (isAvailable || isLoading) {
            clearErrors(AuthenticationProps.Username);
        } else {
            setError(AuthenticationProps.Username, { message: 'Username is already taken' });
        }
    };

    const createUser: SubmitHandler<SignUpFormData> = (data) => trigger(data);

    return (
        <BlockLoader isLoading={isSubmitting}>
            <form onSubmit={handleSubmit(createUser)} className="grid">
                <UsernameField
                    onCheck={handleUsername}
                    error={errors[AuthenticationProps.Username]?.message}
                    {...register(AuthenticationProps.Username)}
                />
                <div className="grid grid-cols-2 gap-x-2">
                    <Input
                        label="First Name"
                        error={errors[AuthenticationProps.FirstName]?.message}
                        {...register(AuthenticationProps.FirstName)}
                    />
                    <Input
                        label="Last Name"
                        error={errors[AuthenticationProps.LastName]?.message}
                        {...register(AuthenticationProps.LastName)}
                    />
                </div>
                <Input
                    label="Email"
                    error={errors[AuthenticationProps.Email]?.message}
                    {...register(AuthenticationProps.Email)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
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
                </div>

                <div className="flex justify-between items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="font-semibold uppercase">Avatar:</div>
                        <AvatarPicker
                            avatar={getValues(AuthenticationProps.Avatar)}
                            onSave={(avatar) => setValue(AuthenticationProps.Avatar, avatar)}
                        />
                    </div>

                    <span className="text-sm uppercase"> ← Click to open the editor</span>
                </div>

                <Button color="primary" size="lg" type="submit" fullWidth>
                    sign up
                </Button>
            </form>
        </BlockLoader>
    );
};

export default SignUpForm;
