import Table from 'features/Table';
import useFetch from 'hooks/useFetch';
import useFetchLazy from 'hooks/useFetchLazy';
import CategoriesApi, { CategoriesURL } from 'modules/Home/api/CategoriesApi';

import { categoriesTableActionsColumn } from '../consts/categoriesTableActionsColumn';
import { categoriesColumns } from '../consts/categoriesTableColumns';

const Categories = () => {
    const {
        data: userCategories,
        mutate: updateCategories,
        isValidating,
    } = useFetch(CategoriesURL.userCategories, (config) => CategoriesApi.getUserCategories(config));
    const { trigger } = useFetchLazy<void, { ids: string[] }>(
        CategoriesURL.deleteCategory,
        CategoriesApi.deleteUserCategories
    );

    const deleteCategories = (body: { ids: string[] }) =>
        trigger(body).then(() => {
            updateCategories();
        });

    const action = categoriesTableActionsColumn(deleteCategories);

    return (
        <div className="h-full">
            <Table
                isLoading={isValidating}
                columns={false ? categoriesColumns : [...categoriesColumns, action]}
                rows={userCategories}
            />
        </div>
    );
};

export default Categories;
