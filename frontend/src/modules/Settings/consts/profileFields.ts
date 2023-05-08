import { DialogNames } from 'core/enums/DialogNames';

export const profileFields = [
    {
        label: 'Username',
        prop: 'username',
        dialog: DialogNames.UpdateUsername,
    },
    {
        label: 'first name',
        prop: 'firstName',
        dialog: DialogNames.UpdateValue,
    },
    {
        label: 'last name',
        prop: 'lastName',
        dialog: DialogNames.UpdateValue,
    },
    // {
    //     label: 'e-mail',
    //     prop: 'email',
    //     dialog: UpdateValueDialog,
    // },
    // {
    //     label: 'phone',
    //     prop: AuthenticationProps.Phone,
    // },
] as const;
