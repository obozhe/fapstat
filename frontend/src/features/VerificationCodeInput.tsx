import BlockLoader from '@ui/BlockLoader';
import Button from '@ui/Button';
import Input from '@ui/Input';
import snackbar from 'components/Snackbar';
import UsersApi, { UsersURL } from 'core/services/UsersApi';
import dayjs from 'dayjs';
import useFetch from 'hooks/useFetch';
import React, { useEffect, useRef, useState } from 'react';

const getTime = (deadline: dayjs.Dayjs) => {
    const now = dayjs();
    const seconds = Math.floor(deadline.diff(now) / 1000);
    const minutes = Math.floor(seconds / 60);
    return seconds >= 0 ? `${minutes}:${(seconds - minutes * 60).toString().padStart(2, '0')}` : '';
};

type Props = {
    userId: string;
    onSubmit: (code: string) => Promise<unknown>;
};

const getDeadline = () => dayjs().add(180, 'seconds');

const VerificationCodeInput = ({ userId, onSubmit }: Props) => {
    const codeRef = useRef('');
    const container = useRef<HTMLDivElement>(null);
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deadline, setDeadline] = useState(getDeadline());

    const { mutate: sendAgain, isLoading: isGettingCode } = useFetch(
        UsersURL.getVerificationCode,
        (config) => UsersApi.getVerificationCode(userId, config),
        {
            onSuccess: () => snackbar.success('Email with the code was successfully sent to you!'),
        }
    );

    useEffect(() => {
        const interval = setInterval(() => setTimer(getTime(deadline)), 1000);

        if (timer === '') {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [deadline, timer]);

    useEffect(() => {
        if (codeRef.current !== code && code.length === 6) {
            codeRef.current = code;
            setIsLoading(true);
            onSubmit(code).finally(() => setIsLoading(false));
        }
    }, [code, onSubmit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputs = container.current?.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;

        if (!e.target.value) {
            return;
        }

        const indexOfFocusedInput = Array.from(inputs).findIndex((input) => document.activeElement === input);
        const inputsCombinedValue = Array.from(inputs)
            .map((input) => input.value)
            .join('')
            .toUpperCase();

        setCode(inputsCombinedValue);

        if (indexOfFocusedInput + 1 !== inputs.length) {
            inputs[indexOfFocusedInput + 1].focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData?.getData('Text').trim();

        if (paste.length !== 6 || !Number.isInteger(Number(paste))) {
            return snackbar.error(`Not valid code to paste: "${paste}"`);
        }

        const inputs = container.current?.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
        Array.from(inputs).forEach((input, i) => (input.value = paste[i]));
        setCode(paste);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Backspace') {
            return;
        }

        const inputs = container.current?.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
        const indexOfFocusedInput = Array.from(inputs).findIndex((input) => document.activeElement === input);

        if (inputs[indexOfFocusedInput].value || indexOfFocusedInput === 0) {
            return;
        }

        inputs[indexOfFocusedInput - 1].focus();
    };

    const onSendAgain = () => {
        sendAgain();
        setDeadline(getDeadline());
    };

    return (
        <BlockLoader isLoading={isLoading || isGettingCode}>
            <div className="flex items-center justify-center flex-col gap-4 uppercase relative">
                <div className="font-semibold"> Enter the code from mail:</div>
                <div ref={container} className="grid grid-cols-6 gap-2 w-64">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Input
                            autoComplete="one-time-code"
                            className="verification-code-input text-xl uppercase"
                            maxLength={1}
                            onChange={handleChange}
                            onPaste={handlePaste}
                            onKeyDown={handleKeyDown}
                            key={i}
                            disableHelper
                        />
                    ))}
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Button disabled={!!timer || isLoading || isGettingCode} onClick={onSendAgain}>
                        SEND AGAIN
                    </Button>
                    <div className="h-8">{timer}</div>
                </div>
            </div>
        </BlockLoader>
    );
};

export default VerificationCodeInput;
