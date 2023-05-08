import Input from '@ui/Input';
import Dialog from 'components/Dialog';
import { useStateContext } from 'hooks/useStateContext';
import { useState } from 'react';

type Props = {
    inputLabel: string;
    inputValue: string;
    request: (value: string) => Promise<unknown>;
};

const UpdateValueDialog = ({ inputLabel, inputValue, request }: Props) => {
    const { isOpen, close } = useStateContext();

    const [value, setValue] = useState(inputValue);
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    const handleSubmit = () => {
        setIsDisabled(true);
        request(value).then(close);
    };

    return (
        <Dialog
            title={`Update ${inputLabel}`}
            isOpen={isOpen}
            onClose={close}
            onSubmit={handleSubmit}
            submitLabel="update"
            disabled={isDisabled}
        >
            <form className="py-2" style={{ minWidth: 400 }}>
                <Input
                    label={inputLabel}
                    value={value}
                    error={error}
                    onChange={(e) => {
                        setIsDisabled(e.target.value === inputValue);
                        setError(e.target.value ? '' : 'Value is required');
                        setValue(e.target.value);
                    }}
                />
            </form>
        </Dialog>
    );
};

export default UpdateValueDialog;
