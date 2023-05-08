import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { DialogProps } from 'core/types/ui';
import { Fragment, ReactNode } from 'react';

import Button from './ui/Button';

type Props = DialogProps & {
    children: ReactNode;
};

const Dialog = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    disabled,
    disableActions,
    submitLabel = 'submit',
}: Props) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <HeadlessDialog className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 overflow-y-auto" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center md:p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel className="w-fit transform overflow-hidden md:rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border-3 border-primary">
                                {title && (
                                    <HeadlessDialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900 uppercase mb-4"
                                    >
                                        {title}
                                    </HeadlessDialog.Title>
                                )}
                                {children}

                                {!disableActions && (
                                    <div className="mt-4 flex flex-col xl:flex-row gap-2">
                                        <Button onClick={onClose} fullWidth>
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={disabled}
                                            color="primary"
                                            type="button"
                                            onClick={onSubmit}
                                            fullWidth
                                            className="-order-1 sm:order-1"
                                        >
                                            {submitLabel}
                                        </Button>
                                    </div>
                                )}
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    );
};

export default Dialog;
