import Button from '@ui/Button';
import { DialogNames } from 'core/enums/DialogNames';
import UsersApi, { UsersURL } from 'core/services/UsersApi';
import { UserDto } from 'core/types/userDto';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import { useStateContext } from 'hooks/useStateContext';

import { profileFields } from '../consts/profileFields';

type ProfileFieldProps = {
    label: string;
    prop: keyof Pick<UserDto, 'email' | 'firstName' | 'lastName' | 'username'>;
    dialog: DialogNames;
};

const ProfileField = ({ label, prop, dialog }: ProfileFieldProps) => {
    const { user, setUser } = useAuth();
    const { open } = useStateContext();

    const { trigger: updateUser } = useFetchLazy<UserDto, Record<string, string>>(UsersURL.update, UsersApi.update);

    const onSubmit = (value: string) => updateUser({ [prop]: value }).then((updatedUser) => setUser(updatedUser));

    return (
        <>
            <div className="grid grid-cols-[140px,1fr] gap-2">
                <div className="flex flex-col">
                    <h3 className="uppercase">{label}</h3>
                    <span>{user?.[prop]}</span>
                </div>
                <Button
                    className="text-lg self-end justify-end justify-self-end"
                    onClick={() =>
                        open(dialog, { inputLabel: label, inputValue: user?.[prop] || '', request: onSubmit })
                    }
                >
                    EDIT
                </Button>
            </div>
        </>
    );
};

const Profile = () => {
    const { open } = useStateContext();

    return (
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between">
            <div className="flex flex-col gap-7">
                {profileFields.map(({ ...rest }) => (
                    <ProfileField {...rest} key={rest.label} />
                ))}
            </div>
            <div className="flex flex-col md:self-end self-start gap-2">
                <Button fullWidth color="secondary" onClick={() => open(DialogNames.UpdatePassword)}>
                    update password
                </Button>
                <Button fullWidth color="error" onClick={() => open(DialogNames.DeleteAccount)}>
                    delete profile
                </Button>
            </div>
        </div>
    );
};

export default Profile;
