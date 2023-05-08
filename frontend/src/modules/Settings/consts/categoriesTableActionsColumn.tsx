import { createColumnHelper } from '@tanstack/react-table';
import ActionIconButton from '@ui/ActionIconButton';
import { CategoryDto } from 'core/types/categoryDto';
import { Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<CategoryDto>();

export const categoriesTableActionsColumn = (deleteCategory: (body: { ids: string[] }) => Promise<void>) =>
    columnHelper.display({
        id: 'actions',
        size: 36,
        maxSize: 36,
        cell: (params) => (
            <ActionIconButton
                color="error"
                className="w-8 h-8"
                title="Delete category"
                request={() => deleteCategory({ ids: [params.row.original.id] })}
            >
                <Trash2 className="w-5 h-5" />
            </ActionIconButton>
        ),
    });
