import Dialog from '@components/Dialog';
import BlockLoader from '@ui/BlockLoader';
import ChipsAutocomplete from '@ui/ChipsAutocomplete';
import DateSelects from '@ui/DateSelects';
import EventRating from '@ui/EventRating';
import Input from '@ui/Input';
import TextArea from '@ui/TextArea';
import { OptionDto } from 'core/types/optionsDto';
import dayjs, { Dayjs } from 'dayjs';
import useFetch from 'hooks/useFetch';
import useFetchLazy from 'hooks/useFetchLazy';
import { useStateContext } from 'hooks/useStateContext';
import CategoriesApi, { CategoriesURL } from 'modules/Home/api/CategoriesApi';
import EventsApi, { EventsURL } from 'modules/Home/api/EventsApi';
import { CreateEventDto } from 'modules/Home/types/event';
import { useEffect, useState } from 'react';

type CreateEventForm = {
    description: string;
    duration: string;
    rating: number;
    date: Dayjs;
    categories: OptionDto[];
};

type Props = { date?: dayjs.Dayjs | string; onSubmit: () => void };

const CreateEventDialog = ({ date, onSubmit }: Props) => {
    const { isOpen, close } = useStateContext();
    const [data, setData] = useState<CreateEventForm>({
        date: dayjs(date),
        duration: '0.5',
        rating: 5,
        description: '',
        categories: [],
    });

    const {
        data: categoryOptions,
        mutate: mutateCategories,
        isLoading: isLoadingCategories,
    } = useFetch<OptionDto[]>(
        CategoriesURL.getCombinedCategories,
        (config) => CategoriesApi.getCombinedCategories(config),
        { revalidateOnMount: false }
    );
    const { trigger: createEvent, isMutating: isCreatingEvent } = useFetchLazy<void, CreateEventDto>(
        EventsURL.createEvent,
        EventsApi.createEvent
    );
    const { trigger: createCategory, isMutating: isCreatingCategory } = useFetchLazy<OptionDto, { value: string }>(
        CategoriesURL.createCategory,
        CategoriesApi.createCategory
    );

    useEffect(() => {
        if (!isOpen) return;

        mutateCategories();
    }, [isOpen, mutateCategories]);

    const isLoading = isCreatingCategory || isLoadingCategories || isCreatingEvent;

    const submit = () => {
        const body = {
            ...data,
            duration: Number(data.duration),
            date: data.date.toISOString(),
            categories: data.categories.map(({ id }) => id as string),
        };

        createEvent(body).then(close).then(onSubmit);
    };

    const updateField = (name: string, value: string | number | dayjs.Dayjs | OptionDto[]) =>
        setData((state) => ({ ...state, [name]: value }));

    return (
        <Dialog isOpen={isOpen} onClose={close} title="Create event" submitLabel="save" onSubmit={submit}>
            <BlockLoader isLoading={isLoading}>
                <form className="flex flex-col gap-4 md:w-[500px] relative">
                    <div className="md:grid md:grid-cols-2 flex flex-col gap-5">
                        <DateSelects
                            className="col-span-2"
                            value={data.date}
                            onChange={(value) => updateField('date', value)}
                            showTimeSelection
                        />

                        <Input
                            className="grid-cols"
                            label="duration (mins)"
                            type="number"
                            pattern="[0-9]*"
                            inputMode="decimal"
                            value={data.duration}
                            onChange={(e) => updateField('duration', e.target.value)}
                            disableHelper
                        />
                    </div>

                    <ChipsAutocomplete
                        label="Category"
                        options={categoryOptions ?? []}
                        value={data.categories}
                        groupBy={(option) => option.groupBy?.toUpperCase() || ''}
                        onDelete={(idToDelete) => {
                            const filteredCategories = data.categories.filter((category) => category.id !== idToDelete);
                            updateField('categories', filteredCategories);
                        }}
                        onChange={async (selectedCategory, selectedCategories) => {
                            if (selectedCategory.id) {
                                return updateField('categories', selectedCategories);
                            }
                            const customCategory = await createCategory({ value: selectedCategory.value });

                            if (!customCategory) return;

                            const updatedCategoryOptions = [...(categoryOptions ?? []), customCategory];
                            const updatedCategoriesValue = [...data.categories, customCategory];

                            await mutateCategories(updatedCategoryOptions);
                            updateField('categories', updatedCategoriesValue);
                        }}
                    />
                    <TextArea
                        label="Description"
                        name="description"
                        onChange={(e) => updateField('description', e.target.value)}
                    />
                    <EventRating
                        label="How was it ?"
                        value={data.rating}
                        onChange={(value: number) => updateField('rating', value)}
                    />
                </form>
            </BlockLoader>
        </Dialog>
    );
};

export default CreateEventDialog;
