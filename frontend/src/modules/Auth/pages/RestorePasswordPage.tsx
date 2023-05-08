import UpdatePasswordForm from '@components/forms/UpdatePasswordForm';
import Stepper from '@ui/Stepper';
import { StepperSteps } from 'core/types/ui';
import { UserDto } from 'core/types/userDto';
import VerificationCodeInput from 'features/VerificationCodeInput';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthApi, { AuthURL } from '../api/AuthApi';
import RestorePasswordEmailForm from '../components/forms/RestorePasswordEmailForm';
import { RestorePasswordDto } from '../types/RestorePasswordDto';

const RestorePasswordPage = () => {
    const { setUser } = useAuth();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [stepperStep, setStepperStep] = useState(0);
    const navigate = useNavigate();

    const { trigger } = useFetchLazy<UserDto, RestorePasswordDto>(AuthURL.updatePassword, AuthApi.updatePassword);

    const handleUserId = (id: string) => {
        setUserId(id);
        setStepperStep((step) => step + 1);
    };

    const handleNewPassword = (newPassword: string) => {
        setPassword(newPassword);
        setStepperStep((step) => step + 1);
    };

    const updatePassword = (code: string) => {
        return trigger({ code, userId, password })
            .then(setUser)
            .then(() => navigate('/'));
    };

    const steps: StepperSteps = [
        {
            content: <RestorePasswordEmailForm onSubmit={handleUserId} />,
        },
        {
            content: <UpdatePasswordForm onSubmit={handleNewPassword} />,
        },
        {
            content: <VerificationCodeInput userId={userId} onSubmit={updatePassword} />,
        },
    ];

    return (
        <div className="flex justify-center px-3 items-center w-full h-full">
            <div className="flex flex-col m-auto max-w-sm w-full gap-2">
                <Stepper steps={steps} step={stepperStep} />
                <Link
                    to="/auth"
                    className="w-fit self-center text-xs font-medium border-b-2 border-transparent hover:border-primary"
                >
                    BACK
                </Link>
            </div>
        </div>
    );
};

export default RestorePasswordPage;
