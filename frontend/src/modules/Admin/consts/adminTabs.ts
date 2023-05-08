import { TabLink } from 'core/types/ui';
import { AdminPaths } from 'routes/paths';

export const adminTabs: TabLink[] = [
    {
        label: 'USERS',
        path: `/admin/${AdminPaths.Users}`,
    },
    {
        label: 'BAN LIST',
        path: `/admin/${AdminPaths.BanList}`,
    },
];
