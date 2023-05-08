import { createColumnHelper } from '@tanstack/react-table';
import { DateFormats } from 'core/enums/DateFormats';
import { CategoryDto } from 'core/types/categoryDto';
import { formatDate } from 'helpers/date';

const columnHelper = createColumnHelper<CategoryDto>();

export const categoriesColumns = [
    columnHelper.accessor('value', {
        header: 'Value',
        size: 100,
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created At',
        size: 100,
        cell: (info) => formatDate(info.getValue(), DateFormats.Date),
    }),
];
