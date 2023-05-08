import { Combobox, Transition } from '@headlessui/react';
import { ReactComponent as DeleteIcon } from '@images/icons/delete-icon.svg';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import { OptionDto } from 'core/types/optionsDto';
import useRange, { GroupOption } from 'hooks/useRange';
import { Fragment, forwardRef, useRef, useState } from 'react';

type ChipProps = {
    onDelete: (id: string) => void;
    option: OptionDto;
};

type ChipsInputProps = {
    onDelete: (id: string) => void;
    label: string;
    value: OptionDto[];
    options: OptionDto[];
    onChange: (selectedOption: OptionDto, selectedOptions: OptionDto[]) => void;
    groupBy?: (option: OptionDto) => string;
};

type VirtualizedListProps = {
    options: OptionDto[];
    groupBy?: (option: OptionDto) => string;
};

const Chip = ({ onDelete, option }: ChipProps) => {
    return (
        <div key={option.id} className="flex items-center text-xs bg-secondary text-white">
            <span className="px-2">{option.value.toUpperCase()}</span>

            <button
                className="mx-1 transition hover:scale-125"
                onClick={() => {
                    if (!option.id) return;

                    onDelete(option.id);
                }}
            >
                <DeleteIcon className="" />
            </button>
        </div>
    );
};

const VirtualizedList = forwardRef<HTMLUListElement, VirtualizedListProps>(({ options, groupBy }, parentRef) => {
    const getScrollElement =
        parentRef && typeof parentRef === 'function' ? () => null : () => parentRef?.current ?? null;

    const { rangeExtractor, updatedOptions, isSticky, isActiveSticky } = useRange(options, groupBy);

    const rowVirtualizer = useVirtualizer({
        count: updatedOptions?.length,
        getScrollElement,
        estimateSize: () => 35,
        overscan: 5,
        rangeExtractor: rangeExtractor,
    });

    return (
        <div
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
            }}
        >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <Combobox.Option
                    key={virtualRow.index}
                    style={{
                        position: isActiveSticky(virtualRow.index) ? 'sticky' : 'absolute',
                        zIndex: isSticky(virtualRow.index) ? `${virtualRow.index + 10}` : undefined,
                        transform: isActiveSticky(virtualRow.index)
                            ? 'translateY(0)'
                            : `translateY(${virtualRow.start}px)`,
                    }}
                    className={({ active }) =>
                        clsx(
                            `relative cursor-default select-none p-2 text-primary w-full h-[${virtualRow.size}px] left-0 top-0`,
                            {
                                'bg-secondary text-white': active && !isSticky(virtualRow.index),
                                'border-b-[1px] border-gray-300 bg-white': isSticky(virtualRow.index),
                            }
                        )
                    }
                    value={updatedOptions?.[virtualRow.index]}
                >
                    <span className="block truncate">{updatedOptions?.[virtualRow.index].value}</span>
                </Combobox.Option>
            ))}
        </div>
    );
});

const ChipsAutocomplete = ({ onDelete, label, value, onChange, options, groupBy }: ChipsInputProps) => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const parentRef = useRef<HTMLUListElement>(null);

    const filteredOptions = value.length ? options.filter((option) => !value?.includes(option)) : options;

    const filteredOptionsByQuery =
        query === ''
            ? filteredOptions
            : filteredOptions.filter(({ value: optionValue }) =>
                  optionValue.toLowerCase().includes(query.toLowerCase())
              );

    return (
        <Combobox
            onChange={(selectedOption: OptionDto | GroupOption) => {
                if ('isGroup' in selectedOption) return;

                onChange(selectedOption, value ? [selectedOption, ...value] : [selectedOption]);
            }}
        >
            <div className="relative">
                <Combobox.Label className="font-semibold uppercase">{label}</Combobox.Label>
                <Combobox.Input
                    onClick={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    className="text-slate-600 h-10 rounded p-2 w-full border-3 border-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 invalid:border-error invalid:text-error focus:invalid:border-error focus:invalid:ring-error"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                    }}
                />
                <Transition
                    as={Fragment}
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    {() => (
                        <Combobox.Options
                            ref={parentRef}
                            static
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                            {!filteredOptionsByQuery.length && query !== '' ? (
                                <>
                                    <div className="py-2 p-4 text-gray-400">Create new:</div>
                                    <Combobox.Option
                                        key="new option"
                                        value={{ value: query, id: null }}
                                        className={({ active }) =>
                                            `relative cursor-default select-none p-2 ${
                                                active ? 'bg-secondary text-white' : 'text-primary'
                                            }`
                                        }
                                    >
                                        {query}
                                    </Combobox.Option>
                                </>
                            ) : (
                                <VirtualizedList options={filteredOptionsByQuery} ref={parentRef} groupBy={groupBy} />
                            )}
                        </Combobox.Options>
                    )}
                </Transition>
                {!!value.length && (
                    <div className="flex gap-3 flex-wrap mt-3">
                        {value.map((option) => (
                            <Chip onDelete={onDelete} option={option} key={option.id} />
                        ))}
                    </div>
                )}
            </div>
        </Combobox>
    );
};

export default ChipsAutocomplete;
