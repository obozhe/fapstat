import { isAdmin } from 'helpers/user';
import useAuth from 'hooks/useAuth';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
    children: ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
    const { user } = useAuth();

    if (!isAdmin(user)) {
        return <Navigate to="/no-access" />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
