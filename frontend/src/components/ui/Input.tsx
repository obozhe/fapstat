import clsx from 'clsx';
import { Size, sizes } from 'core/enums/ui-sizes';
import React, { ForwardedRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    disableHelper?: boolean;
    error?: string;
    helper?: string;
    endAdornment?: JSX.Element;
    _size?: Size;
};

const Input = React.forwardRef(
    (
        { label, error, helper, endAdornment, disableHelper, _size = 'lg', className = '', ...rest }: Props,
        ref: ForwardedRef<HTMLInputElement | null>
    ) => {
        return (
            <fieldset>
                {label && (
                    <label htmlFor={label + '-field'}>
                        <span className="font-semibold uppercase">{label}</span>
                    </label>
                )}

                <div className="relative">
                    <input
                        {...rest}
                        ref={ref}
                        style={{ height: sizes[_size] }}
                        className={clsx(
                            'rounded p-2 w-full border-3 bg-bg-main',
                            'focus:outline-none focus:border-secondary',
                            'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 invalid:border-error invalid:text-error',
                            { 'pr-12': endAdornment },
                            { 'border-error text-error': error },
                            { 'border-primary': !error },
                            className
                        )}
                        id={label + '-field'}
                    />
                    {endAdornment && (
                        <span className="absolute h-9 w-9 top-1/2 -translate-y-1/2 right-2 flex justify-center items-center">
                            {endAdornment}
                        </span>
                    )}
                </div>
                {!disableHelper && (
                    <div className={clsx('text-sm h-5', error ? 'text-error' : 'text-gray-500')}>
                        {error || helper || ''}
                    </div>
                )}
            </fieldset>
        );
    }
);

export default Input;
