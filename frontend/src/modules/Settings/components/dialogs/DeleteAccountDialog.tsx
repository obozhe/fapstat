import Dialog from '@components/Dialog';
import { useStateContext } from 'hooks/useStateContext';

const DeleteAccountDialog = () => {
    const { isOpen, close } = useStateContext();

    return (
        <Dialog
            isOpen={isOpen}
            onClose={close}
            title="Deleting Account"
            onSubmit={() =>
                window.open(
                    'https://www.youtube.com/watch?v=HelwL9XHvQk&ab_channel=%D0%BE%D1%80%D0%B8%D0%B3%D0%B8%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8%D1%87'
                )
            }
        >
            <p>Are u sure ?</p>
        </Dialog>
    );
};

export default DeleteAccountDialog;
