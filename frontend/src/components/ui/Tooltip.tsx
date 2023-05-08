import { Transition } from '@headlessui/react';
import Tippy, { useSingleton } from '@tippyjs/react/headless';
import { useState } from 'react';

type Props = {
    children: JSX.Element;
    content: JSX.Element | string;
    isInteractive?: boolean;
    className?: string
};

const Tooltip = ({ children, content, isInteractive, className }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [source, target] = useSingleton();

    return (
        <>
            <Tippy
                onMount={() => setIsOpen(true)}
                onHide={() => setIsOpen(false)}
                singleton={source}
                render={(attrs, tooltip) => (
                    <Transition
                        show={isOpen}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-y-3 opacity-0"
                        enterTo="-translate-y-0 opacity-1"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="-translate-y-0 opacity-1"
                        leaveTo="translate-y-3 opacity-0"
                    >
                        <div
                            className="p-1 rounded text-white"
                            style={{ backgroundColor: 'rgba(10,10,10,0.8)' }}
                            {...attrs}
                        >
                            {tooltip}
                        </div>
                    </Transition>
                )}
            />

            <Tippy placement="top" arrow singleton={target} content={content} interactive={isInteractive}>
                <span className={className}>{children}</span>
            </Tippy>
        </>
    );
};

export default Tooltip;
