import Loader from '@ui/Loader';
import AchievementUnlockScreen from 'features/AchievementUnlockScreen';
import useAuth from 'hooks/useAuth';
import Header from 'layout/Header';
import { Navigate, Outlet } from 'react-router-dom';

const HEADER_HEIGHT = '120px';
const ViewContainer = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Loader />;

    if (!user) return <Navigate to="/get-started" />;

    return (
        <>
            <AchievementUnlockScreen />
            <div
                className="min-h-full mx-auto max-w-[1600px] font-montserrat p-4 grid"
                style={{ gridTemplateRows: `${HEADER_HEIGHT} 1fr` }}
            >
                <div style={{ height: HEADER_HEIGHT }}>
                    <Header />
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default ViewContainer;
