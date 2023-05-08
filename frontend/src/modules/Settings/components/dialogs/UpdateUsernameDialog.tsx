import Dialog from '@components/Dialog';
import UsersApi, { UsersURL } from 'core/services/UsersApi';
import { UserDto } from 'core/types/userDto';
import UsernameField, { UsernameCheckResult } from 'features/UsernameField';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import { useStateContext } from 'hooks/useStateContext';
import { ChangeEvent, useState } from 'react';

const UpdateUsernameDialog = () => {
    const { isOpen, close } = useStateContext();

    const { setUser, user } = useAuth();
    const [username, setUsername] = useState(user?.username);
    const [isDisabled, setIsDisabled] = useState(true);

    const { trigger: updateUser } = useFetchLazy<UserDto, { username?: string }>(UsersURL.update, UsersApi.update);

    const handleSubmit = () => {
        setIsDisabled(true);
        updateUser({ username }).then(setUser).then(close);
    };

    const handleUsernameCheck = ({ isAvailable, isLoading }: UsernameCheckResult) => {
        setIsDisabled(isLoading || !isAvailable);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsDisabled(username === e.target.value);
        setUsername(e.target.value);
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={close}
            title="Update Username"
            disabled={isDisabled}
            onSubmit={handleSubmit}
            submitLabel="update"
        >
            <div className="w-96">
                <UsernameField value={username} onChange={onChange} onCheck={handleUsernameCheck} />
            </div>
        </Dialog>
    );
};

export default UpdateUsernameDialog;
