import NavTabs from '@ui/NavTabs';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AdminPaths } from 'routes/paths';

import { adminTabs } from '../consts/adminTabs';

const AdminPage = () => {
    const { pathname } = useLocation();

    if (pathname === '/' + AdminPaths.Root) {
        return <Navigate to={'./' + AdminPaths.Users} />;
    }

    return (
        <div className="grid grid-rows-[auto_1fr] gap-2 h-full">
            <NavTabs links={adminTabs} />

            <Outlet />
        </div>
    );
};
export default AdminPage;
