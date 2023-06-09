import {
    ColumnDef,
    PaginationState,
    Row,
    RowSelectionState,
    Table as TanstackTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Button from '@ui/Button';
import Input from '@ui/Input';
import Loader from '@ui/Loader';
import Select from '@ui/Select';
import Tooltip from '@ui/Tooltip';
import clsx from 'clsx';
import { useDidMountEffect } from 'hooks/useDidMountEffect';
import { useDidUpdateEffect } from 'hooks/useDidUpdateEffect';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

import getSelectionColumn from './consts/selectionColumn';

type Props<TRow> = {
    mode?: 'client' | 'server';
    columns: ColumnDef<TRow, any>[];
    rows: TRow[] | undefined;
    total?: number;
    isLoading?: boolean;
    enableSelection?: boolean;
    getRowClassName?: (row: Row<TRow>) => string | undefined;
    onSelectionChange?: (selectedRows: string[]) => void;
    isRowSelectable?: (row: Row<TRow>) => boolean;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (page: number) => void;
    setTable?: (table: TanstackTable<TRow>) => void;
};

const rowHeight = 48;

const Table = <TRow extends { id: string }>({
    mode = 'client',
    columns,
    rows,
    total = 0,
    isLoading,
    enableSelection,
    setTable,
    onSelectionChange,
    isRowSelectable,
    onPageChange,
    onPageSizeChange,
    getRowClassName,
}: Props<TRow>) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    const table = useReactTable({
        state: {
            rowSelection: enableSelection ? rowSelection : undefined,
            pagination: { pageIndex, pageSize },
        },
        data: rows ?? [],
        columns: enableSelection ? [getSelectionColumn<TRow>(), ...columns] : columns,
        pageCount: mode === 'server' ? Math.ceil(total / pageSize) : undefined,
        manualPagination: mode === 'server',
        enableRowSelection: (row) => !!enableSelection && (isRowSelectable ? isRowSelectable(row) : true),
        onPaginationChange: mode === 'server' ? setPagination : undefined,
        onRowSelectionChange: enableSelection ? setRowSelection : undefined,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        getPaginationRowModel: mode === 'client' ? getPaginationRowModel() : undefined,
    });

    useDidMountEffect(() => setTable && setTable(table));
    useDidUpdateEffect(() => onPageChange && onPageChange(pageIndex), [pageIndex]);
    useDidUpdateEffect(() => onPageSizeChange && onPageSizeChange(pageSize), [pageSize]);
    useDidUpdateEffect(() => onSelectionChange && onSelectionChange(Object.keys(rowSelection)), [rowSelection]);

    const gridTemplateColumns = table
        .getAllColumns()
        .map((column) =>
            column.columnDef.maxSize !== Number.MAX_SAFE_INTEGER
                ? `minmax(${column.columnDef.size}px, ${column.columnDef.maxSize}px)`
                : `minmax(${column.columnDef.size}px, 1fr)`
        )
        .join(' ');

    console.log(gridTemplateColumns);

    return (
        <div className="h-full relative">
            <div className="h-full grid grid-rows-[1fr,_auto] border-3 border-primary">
                <div ref={tableRef} className="h-full border-b-3 border-primary">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <div
                            key={headerGroup.id}
                            className="grid w-full whitespace-nowrap px-4 border-b-3 border-primary grid-flow-col gap-1"
                            style={{
                                height: rowHeight,
                                gridTemplateColumns,
                            }}
                        >
                            {headerGroup.headers.map((header) => (
                                <div key={header.id} className="uppercase font-bold flex items-center">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </div>
                            ))}
                        </div>
                    ))}

                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div
                            className="overflow-auto"
                            style={{
                                maxHeight: tableRef.current?.offsetHeight
                                    ? tableRef.current?.offsetHeight - rowHeight - 3
                                    : '100%',
                            }}
                        >
                            {table.getRowModel().rows.map((row) => (
                                <div
                                    key={row.id}
                                    className={clsx(
                                        'grid items-center w-full border-b px-4 gap-1',
                                        getRowClassName && getRowClassName(row)
                                    )}
                                    style={{
                                        height: rowHeight,
                                        gridTemplateColumns,
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <div key={cell.id} className="flex items-center last:justify-end">
                                            {cell.column.accessorFn ? (
                                                <Tooltip
                                                    isInteractive
                                                    content={<div className="text-xs">{cell.getValue() as string}</div>}
                                                    className="truncate"
                                                >
                                                    <span>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </span>
                                                </Tooltip>
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between flex-col sm:flex-row p-2 item-center">
                    <div className="flex gap-1 items-center justify-between sm:justify-normal">
                        Page
                        <span className="font-bold">
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <span className="flex items-center gap-1">| Go to page:</span>
                        <Input
                            className="!w-14"
                            _size="sm"
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            disableHelper
                        />
                    </div>

                    {!!Object.keys(rowSelection).length && (
                        <div className="flex items-center gap-1">
                            Selected
                            <span className="font-bold">
                                {Object.keys(rowSelection).length} of {total || rows?.length || 0}
                            </span>
                            <Tooltip content={<div className="text-xs">Deselect All</div>}>
                                <Button size="sm" isIconButton onClick={() => setRowSelection({})}>
                                    <X />
                                </Button>
                            </Tooltip>
                        </div>
                    )}

                    {table.getPageCount() > 1 && (
                        <div className="flex gap-1 items-center flex-col md:flex-row">
                            <div className="sm:mr-2 self-start">
                                <Select
                                    size="sm"
                                    options={[10, 20, 30, 40, 50].map((size) => ({
                                        label: `Show ${size} rows`,
                                        value: size,
                                    }))}
                                    value={table.getState().pagination.pageSize}
                                    onChange={(value) => table.setPageSize(Number(value))}
                                    showAbove
                                />
                            </div>

                            <div className="flex gap-1 self-start">
                                <Button
                                    isIconButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ChevronFirst />
                                </Button>
                                <Button
                                    isIconButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ChevronLeft />
                                </Button>
                                <Button
                                    isIconButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ChevronRight />
                                </Button>
                                <Button
                                    isIconButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ChevronLast />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Table;
