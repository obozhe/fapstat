import { Menu, Transition } from '@headlessui/react';
import Avatar from 'components/Avatar';
import UserApi, { UsersURL } from 'core/services/UsersApi';
import { isAdmin } from 'helpers/user';
import useAuth from 'hooks/useAuth';
import useFetchLazy from 'hooks/useFetchLazy';
import { Crown, LogOut, User } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AdminPaths } from 'routes/paths';

const Header = () => {
    const { user, setUser } = useAuth();

    const { trigger: logout } = useFetchLazy(UsersURL, UserApi.signOut, { onSuccess: () => setUser(null) });

    return (
        <header className="flex justify-between h-full items-center">
            <Link to="/">
                <span className="font-bold">FAPSTAT.ME</span>
            </Link>
            {user && (
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button>
                            <Avatar color={user.avatar.color} emoji={user.avatar.emoji} />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="p-1 absolute z-10 right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {isAdmin(user) && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to={'./' + AdminPaths.Root}
                                            className={`${
                                                active ? 'bg-secondary text-white' : 'text-primary'
                                            } group flex gap-2 w-full items-center rounded-md p-2 text-sm`}
                                        >
                                            <Crown className="w-6 h-6" />
                                            <span>Admin</span>
                                        </Link>
                                    )}
                                </Menu.Item>
                            )}

                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="my"
                                        className={`${
                                            active ? 'bg-secondary text-white' : 'text-primary'
                                        } group flex gap-2 w-full items-center rounded-md p-2 text-sm`}
                                    >
                                        <User className="w-6 h-6" />
                                        <span>Profile</span>
                                    </Link>
                                )}
                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="./get-started"
                                        onClick={() => logout()}
                                        className={`${
                                            active ? 'bg-secondary text-white' : 'text-primary'
                                        } group flex gap-2 w-full items-center rounded-md p-2 text-sm`}
                                    >
                                        <LogOut className="w-6 h-6" />
                                        <span>Logout</span>
                                    </Link>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            )}
        </header>
    );
};
export default Header;
