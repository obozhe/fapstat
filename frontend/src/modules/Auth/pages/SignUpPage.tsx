import Stepper from '@ui/Stepper';
import { StepperSteps } from 'core/types/ui';
import { UserDto } from 'core/types/userDto';
import VerificationCodeInput from 'features/VerificationCodeInput';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import SignUpForm from 'modules/Auth/components/forms/SignUpForm';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthApi, { AuthURL } from '../api/AuthApi';

const SignUpPage = () => {
    const { setUser } = useAuth();
    const [userId, setUserId] = useState('');
    const [stepperStep, setStepperStep] = useState(0);
    const navigate = useNavigate();

    const { trigger: verify } = useFetchLazy<UserDto, { code: string; userId: string }>(AuthURL.verify, AuthApi.verify);

    const onRegister = (id: string) => {
        setUserId(id);
        setStepperStep((step) => step + 1);
    };

    const onVerify = (code: string) => {
        return verify({ userId, code })
            .then(setUser)
            .then(() => navigate('/'));
    };

    const steps: StepperSteps = [
        {
            content: <SignUpForm onRegister={onRegister} />,
        },
        {
            content: <VerificationCodeInput userId={userId} onSubmit={onVerify} />,
        },
    ];

    return (
        <div className="flex justify-center px-3 items-center w-full h-full">
            <div className="flex flex-col m-auto max-w-md w-full gap-2">
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

export default SignUpPage;
