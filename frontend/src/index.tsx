import Loader from '@ui/Loader';
import StateContextProvider from 'containers/StateContext';
import DialogManager from 'features/DialogManager';
import { SnackbarProvider } from 'notistack';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr/_internal';

import './assets/styles/index.scss';
import { router } from './routes/Router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense fallback={<Loader />}>
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                    refreshInterval: 0,
                }}
            >
                <StateContextProvider>
                    <RouterProvider router={router} />
                    <DialogManager />
                </StateContextProvider>
            </SWRConfig>
        </Suspense>
        <SnackbarProvider
            preventDuplicate
            dense
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            maxSnack={5}
        />
    </React.StrictMode>
);
