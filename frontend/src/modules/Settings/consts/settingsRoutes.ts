import Achievement from '../components/Achievement';
import Categories from '../components/Categories';
import Profile from '../components/Profile';

export const settingsRoutes = [
    { name: 'profile', path: 'settings', element: Profile },
    { name: 'categories', path: 'categories', element: Categories },
    { name: 'achievements', path: 'achievements', element: Achievement },
];
