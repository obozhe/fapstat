import { createColumnHelper } from '@tanstack/react-table';
import { TableData } from 'core/types/ui';
import { UserDto } from 'core/types/userDto';
import { isAdmin } from 'helpers/user';
import { Angry, Smile, Trash2 } from 'lucide-react';

import ActionIconButton from '../../../components/ui/ActionIconButton';

const columnHelper = createColumnHelper<UserDto>();

export const usersTableActionsColumn = (
    isBanListView: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    banUsers: (body: { ids: string[] }) => Promise<void>,
    unBanUsers: (body: { ids: string[] }) => Promise<void>,
    deleteUsers: (body: { ids: string[] }) => Promise<void>,
    refetchCB: () => Promise<TableData<UserDto> | undefined>
) =>
    columnHelper.display({
        id: 'actions',
        size: 80,
        maxSize: 80,
        cell: (params) => (
            <div className="flex gap-2 justify-center items-center">
                <ActionIconButton
                    color="error"
                    className="w-8 h-8"
                    title="Delete User"
                    disabled={isAdmin(params.row.original)}
                    setLoading={setIsLoading}
                    request={() => deleteUsers({ ids: [params.row.original.id] }).then(refetchCB)}
                >
                    <Trash2 className="w-5 h-5" />
                </ActionIconButton>
                <ActionIconButton
                    className="w-8 h-8"
                    title={isBanListView ? 'Unban User' : 'Ban User'}
                    disabled={isAdmin(params.row.original)}
                    setLoading={setIsLoading}
                    request={() =>
                        (isBanListView
                            ? unBanUsers({ ids: [params.row.original.id] })
                            : banUsers({ ids: [params.row.original.id] })
                        ).then(refetchCB)
                    }
                >
                    {isBanListView ? <Smile className="w-5 h-5" /> : <Angry className="w-5 h-5" />}
                </ActionIconButton>
            </div>
        ),
    });
