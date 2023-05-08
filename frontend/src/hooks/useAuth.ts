import UsersApi, { UsersURL } from 'core/services/UsersApi';

import useFetch from './useFetch';

const useAuth = () => {
    const { data: user, isLoading, mutate } = useFetch(UsersURL.fetchUser, (config) => UsersApi.fetchUser(config), {});

    return { isLoading, user: user || null, setUser: mutate };
};

export default useAuth;
