/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Table as TanstackTable } from '@tanstack/react-table';
import { TableData, TableOptionsDto } from 'core/types/ui';
import { UserDto } from 'core/types/userDto';
import Table from 'features/Table';
import { isAdmin } from 'helpers/user';
import useFetch from 'hooks/useFetch';
import useFetchLazy from 'hooks/useFetchLazy';
import { Angry, Smile, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AdminPaths } from 'routes/paths';

import ActionIconButton from '../../../components/ui/ActionIconButton';
import AdminApi, { AdminURL } from '../api/AdminApi';
import { usersTableActionsColumn } from '../consts/usersTableActionsColumn';
import { usersTableColumns } from '../consts/usersTableColumns';

const bannedPath = '/admin/' + AdminPaths.BanList;

const getRowClass = (row: Row<UserDto>) => {
    if (isAdmin(row.original)) {
        return 'bg-secondary bg-opacity-20';
    }

    return '';
};

const UsersTable = () => {
    const isBanListView = location.pathname === bannedPath;
    const table = useRef<TanstackTable<UserDto> | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [tableOptions, setTableOptions] = useState<TableOptionsDto>({
        page: 0,
        pageSize: 25,
        filters: { banned: isBanListView },
    });

    const {
        data,
        isLoading: loading,
        mutate: usersUpdate,
        mutate,
    } = useFetch<TableData<UserDto>, TableOptionsDto>([AdminURL.getUsers, tableOptions], (config) =>
        AdminApi.getUsers(tableOptions, config)
    );

    const { trigger: ban } = useFetchLazy<void, { ids: string[] }>(AdminURL.ban, AdminApi.ban);
    const { trigger: unBan } = useFetchLazy<void, { ids: string[] }>(AdminURL.unBan, AdminApi.unBan);
    const { trigger: deleteUsers } = useFetchLazy<void, { ids: string[] }>(AdminURL.deleteUsers, AdminApi.deleteUsers);

    useEffect(() => {
        table.current?.setPageIndex(0);
        table.current?.setRowSelection({});

        setTableOptions((options) => ({
            ...options,
            filters: { ...options.filters, banned: isBanListView },
        }));

        return () => {
            mutate(undefined);
        };
    }, [isBanListView, mutate]);

    const actions = usersTableActionsColumn(isBanListView, setIsLoading, ban, unBan, deleteUsers, () => usersUpdate());

    return (
        <div className="h-full grid grid-rows-[auto_1fr]">
            <div className="flex gap-2 justify-end mb-2">
                <ActionIconButton
                    color="error"
                    title="Delete Selected Users"
                    disabled={loading || !selectedIds.length}
                    setLoading={setIsLoading}
                    request={() => deleteUsers({ ids: selectedIds }).then(() => usersUpdate())}
                >
                    <Trash2 className="w-6 h-6" />
                </ActionIconButton>

                <ActionIconButton
                    title={isBanListView ? 'Unban Selected Users' : 'Ban Selected Users'}
                    disabled={loading || !selectedIds.length}
                    setLoading={setIsLoading}
                    request={() =>
                        (isBanListView ? unBan({ ids: selectedIds }) : ban({ ids: selectedIds })).then(() =>
                            usersUpdate()
                        )
                    }
                >
                    {isBanListView ? <Smile className="w-6 h-6" /> : <Angry className="w-6 h-6" />}
                </ActionIconButton>
            </div>

            <Table
                mode="server"
                enableSelection
                isLoading={loading || isLoading}
                columns={[...usersTableColumns, actions]}
                rows={data?.rows}
                onSelectionChange={(ids) => setSelectedIds(ids)}
                isRowSelectable={(row: Row<UserDto>) => !isAdmin(row.original)}
                total={data?.total}
                onPageChange={(page) => setTableOptions((options) => ({ ...options, page }))}
                onPageSizeChange={(pageSize) => setTableOptions((options) => ({ ...options, pageSize }))}
                getRowClassName={getRowClass}
                setTable={(t) => {
                    table.current = t;
                }}
            />
        </div>
    );
};

export default UsersTable;
