import AuthHandler from 'containers/AuthHandler';
import ErrorBoundary from 'containers/ErrorBoundary';
import PrivateRoute from 'containers/PrivateRoute';
import ViewContainer from 'containers/ViewContainer';
import InfoPage from 'layout/InfoPage';
import UsersTable from 'modules/Admin/components/UsersTable';
import AdminPage from 'modules/Admin/pages/AdminPage';
import RestorePasswordPage from 'modules/Auth/pages/RestorePasswordPage';
import SignInPage from 'modules/Auth/pages/SignInPage';
import SignUpPage from 'modules/Auth/pages/SignUpPage';
import ComingSoon from 'modules/ComingSoonPage';
import HomePage from 'modules/Home/pages/HomePage';
import { settingsRoutes } from 'modules/Settings/consts/settingsRoutes';
import SettingsPage from 'modules/Settings/page/SettingsPage';
import StartPage from 'modules/StartPage';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AdminPaths, AuthPaths } from './paths';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ViewContainer />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Navigate to="home" />,
            },
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: AdminPaths.Root,
                element: (
                    <PrivateRoute>
                        <AdminPage />
                    </PrivateRoute>
                ),
                children: [
                    {
                        path: AdminPaths.Users,
                        element: <UsersTable />,
                    },
                    {
                        path: AdminPaths.BanList,
                        element: <UsersTable />,
                    },
                ],
            },
            {
                path: 'my',
                element: <SettingsPage />,
                children: settingsRoutes.map(({ path, element: Element }) => ({
                    path,
                    element: <Element />,
                })),
            },
        ],
    },
    {
        path: AuthPaths.Root,
        element: <AuthHandler />,
        children: [
            {
                index: true,
                element: <Navigate to="sign-in" />,
            },
            {
                path: AuthPaths.SignIn,
                element: <SignInPage />,
            },
            {
                path: AuthPaths.SignUp,
                element: <SignUpPage />,
            },
            {
                path: AuthPaths.PasswordRestore,
                element: <RestorePasswordPage />,
            },
        ],
    },
    {
        path: 'get-started',
        element: <StartPage />,
    },
    {
        path: 'coming-soon',
        element: <ComingSoon />,
    },
    {
        path: '*',
        element: (
            <InfoPage message="page is not found :(" actionLabel="BACK" onAction={() => history.back()} errorState />
        ),
    },
]);
