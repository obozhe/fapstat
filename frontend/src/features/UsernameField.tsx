import Input from '@ui/Input';
import UsersApi, { UsersURL } from 'core/services/UsersApi';
import useDebounce from 'hooks/useDebounce';
import useFetchLazy from 'hooks/useFetchLazy';
import { Check, Loader2, X } from 'lucide-react';
import React, { ForwardedRef, InputHTMLAttributes, useState } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    onCheck: (result: UsernameCheckResult) => void;
};

export type UsernameCheckResult = { username: string; isAvailable: boolean; isLoading: boolean };

export const UsernameField = React.forwardRef(
    ({ error, onChange, onCheck, ...rest }: Props, ref: ForwardedRef<HTMLInputElement | null>) => {
        const {
            trigger,
            isMutating: isLoading,
            data: isAvailable,
        } = useFetchLazy<boolean, string>(UsersURL.isUsernameFree, UsersApi.isUsernameFree);
        const [isTyping, setIsTyping] = useState(false);
        const checkUsername = useDebounce((username: string) =>
            trigger(username).then((available) => {
                setIsTyping(false);

                if (onCheck && typeof available === 'boolean') {
                    onCheck({ username, isAvailable: available, isLoading: false });
                }
            })
        );

        const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(e);
            }

            if (!e.target.value) {
                onCheck({ username: '', isAvailable: false, isLoading: false });
                return;
            }

            onCheck({ username: e.target.value, isAvailable: false, isLoading: true });
            setIsTyping(true);
            checkUsername(e.target.value);
        };

        return (
            <Input
                {...rest}
                ref={ref}
                label="Username"
                onChange={handleChange}
                error={error}
                endAdornment={
                    isLoading || isTyping ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : isAvailable && !error ? (
                        <Check className="h-5 w-5 text-green-600" />
                    ) : (
                        <X className="h-5 w-5 text-error" />
                    )
                }
            />
        );
    }
);

export default UsernameField;
