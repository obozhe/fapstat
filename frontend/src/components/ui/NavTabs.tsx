import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { TabLink } from 'core/types/ui';
import { useDidUpdateEffect } from 'hooks/useDidUpdateEffect';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    links: TabLink[];
};

const NavTabs = ({ links }: Props) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(links.findIndex(({ path }) => path === pathname));

    useDidUpdateEffect(() => {
        navigate(links[selectedIndex].path);
    }, [selectedIndex]);

    return (
        <div className="w-full max-w-md">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="flex space-x-1 rounded bg-primary p-2">
                    {links.map(({ label }) => (
                        <Tab
                            key={label}
                            className={({ selected }) =>
                                clsx(
                                    'w-full rounded-sm py-2.5 text-sm leading-5',
                                    'ring-secondary ring-opacity-60 ring-offset-2 ring-offset-secondary focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white shadow text-primary font-bold'
                                        : 'text-white hover:bg-white/[0.12]'
                                )
                            }
                        >
                            {label}
                        </Tab>
                    ))}
                </Tab.List>
            </Tab.Group>
        </div>
    );
};

export default NavTabs;
