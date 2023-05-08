import Dialog from '@components/Dialog';
import UpdatePasswordForm from '@components/forms/UpdatePasswordForm';
import Button from '@ui/Button';
import Stepper from '@ui/Stepper';
import UsersApi, { UsersURL } from 'core/services/UsersApi';
import { StepperSteps } from 'core/types/ui';
import { UserDto } from 'core/types/userDto';
import VerificationCodeInput from 'features/VerificationCodeInput';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import { useStateContext } from 'hooks/useStateContext';
import { useState } from 'react';

const UpdatePasswordDialog = () => {
    const { isOpen, close } = useStateContext();

    const { user } = useAuth();
    const [password, setPassword] = useState('');
    const [stepperStep, setStepperStep] = useState(0);

    const { trigger } = useFetchLazy<UserDto, { password: string; code: string }>(
        UsersURL.updatePassword,
        UsersApi.updatePassword
    );

    const handleNewPassword = (newPassword: string) => {
        setPassword(newPassword);
        setStepperStep((step) => step + 1);
    };

    const updatePassword = (code: string) => {
        return trigger({ code, password }).then(close);
    };

    const steps: StepperSteps = [
        { content: <UpdatePasswordForm onSubmit={handleNewPassword} /> },
        { content: <VerificationCodeInput userId={user?.id || ''} onSubmit={updatePassword} /> },
    ];

    return (
        <Dialog isOpen={isOpen} onClose={close} title="Update Password" disableActions>
            <div className="sm:w-96 flex flex-col gap-1">
                <Stepper steps={steps} step={stepperStep} />
                <Button fullWidth size="sm" onClick={close}>
                    cancel
                </Button>
            </div>
        </Dialog>
    );
};

export default UpdatePasswordDialog;
