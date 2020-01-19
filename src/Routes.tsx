import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Router } from 'lib/router';

import { MainPage } from 'pages/main';
import { NotFoundPage } from 'pages/notFound';
import MainLayout from 'layouts/main';

const routes = {
    '/': (
        <MainLayout>
            <MainPage />
        </MainLayout>
    ),
    '/page/:page': (
        <MainLayout>
            <MainPage />
        </MainLayout>
    ),
    '': (
        <MainLayout>
            <NotFoundPage />
        </MainLayout>
    ),
};

const Routes = observer(() => {
    return <Router global routes={routes} />;
});

export default Routes;
