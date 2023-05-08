import UpdateValueDialog from 'components/dialogs/UpdateValueDialog';
import { useStateContext } from 'hooks/useStateContext';
import CreateEventDialog from 'modules/Home/components/dialogs/CreateEventDialog';
import DeleteAccountDialog from 'modules/Settings/components/dialogs/DeleteAccountDialog';
import UpdatePasswordDialog from 'modules/Settings/components/dialogs/UpdatePasswordDialog';
import UpdateUsernameDialog from 'modules/Settings/components/dialogs/UpdateUsernameDialog';
import 'react';

import { DialogNames } from '../core/enums/DialogNames';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDialogByName = (name: DialogNames | null, props: any) => {
    switch (name) {
        case DialogNames.CreateEvent:
            return <CreateEventDialog {...props} />;

        case DialogNames.UpdateValue:
            return <UpdateValueDialog {...props} />;

        case DialogNames.DeleteAccount:
            return <DeleteAccountDialog />;

        case DialogNames.UpdatePassword:
            return <UpdatePasswordDialog />;

        case DialogNames.UpdateUsername:
            return <UpdateUsernameDialog />;

        default:
            return null;
    }
};

const DialogManager = () => {
    const { name, props } = useStateContext();

    return getDialogByName(name, props);
};

export default DialogManager;
