import { createColumnHelper } from '@tanstack/react-table';
import { DateFormats } from 'core/enums/DateFormats';
import { UserDto } from 'core/types/userDto';
import { formatDate } from 'helpers/date';

// export const usersTableColumns: GridColDef[] = [
//     { field: 'email', headerName: 'Email', flex: 1, minWidth: 250 },
//     { field: 'username', headerName: 'Username', flex: 1, minWidth: 250 },
//     { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 150 },
//     { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 150 },
//     {
//         field: 'lastLogin',
//         headerName: 'Last Login',
//         flex: 1,
//         minWidth: 160,
//         valueFormatter: (params: GridValueFormatterParams<string>) => formatDate(params.value, DateFormats.Grid),
//     },
//     {
//         field: 'createdAt',
//         headerName: 'Created At',
//         flex: 1,
//         minWidth: 160,
//         valueFormatter: (params: GridValueFormatterParams<string>) => formatDate(params.value, DateFormats.Grid),
//     },
// ];

const columnHelper = createColumnHelper<UserDto>();

export const usersTableColumns = [
    columnHelper.accessor('email', {
        header: 'Email',
        size: 200,
    }),
    columnHelper.accessor('username', {
        header: 'Username',
        size: 200,
    }),
    columnHelper.accessor('firstName', {
        header: 'First Name',
        size: 120,
    }),
    columnHelper.accessor('lastName', {
        header: 'Last Name',
        size: 120,
    }),
    columnHelper.accessor('lastLogin', {
        header: 'Last Login',
        size: 160,
        cell: (info) => formatDate(info.getValue(), DateFormats.Grid),
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created At',
        size: 160,
        cell: (info) => formatDate(info.getValue(), DateFormats.Grid),
    }),
];
