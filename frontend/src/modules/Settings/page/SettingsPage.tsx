import { Navigate, Outlet, useOutlet } from 'react-router-dom';

import SettingsNavigation from '../components/SettingsNavigation';

const SettingsPage = () => {
    const isOutletExists = useOutlet();

    if (!isOutletExists) {
        return <Navigate to="settings" />;
    }

    return (
        <div className="flex flex-col gap-10 md:gap-32 md:flex-row">
            <SettingsNavigation />
            <div className="flex-[3]">
                <Outlet />
            </div>
        </div>
    );
};

export default SettingsPage;
