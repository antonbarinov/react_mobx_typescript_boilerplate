import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Router } from 'lib/router';

import { MainPage } from 'pages/main';
import { NotFoundPage } from 'pages/notFound';
import { MainLayout } from 'layouts/main';
import { AuthLayout } from 'layouts/auth';
import { LoginPage } from 'pages/login';
import { SignupPage } from 'pages/signup';
import { ProfilePage } from 'pages/profile';

const routes = {
    '/': (
        <MainLayout>
            <MainPage />
        </MainLayout>
    ),
    '/profile': (
        <MainLayout privateRoute>
            <ProfilePage />
        </MainLayout>
    ),
    '/page/:page': (
        <MainLayout>
            <MainPage />
        </MainLayout>
    ),
    '/login': (
        <AuthLayout>
            <LoginPage />
        </AuthLayout>
    ),
    '/signup': (
        <AuthLayout>
            <SignupPage />
        </AuthLayout>
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
