import * as React from 'react';
import { Router } from 'lib/Router';

import { MainPage } from 'pages/main';
import { NotFoundPage } from 'pages/notFound';
import { MainLayout } from 'layouts/main';
import { AuthLayout } from 'layouts/auth';
import { LoginPage } from 'pages/login';
import { SignupPage } from 'pages/signup';
import { ProfilePage } from 'pages/profile';
import { ElectroCalcPage } from 'pages/electro_calc';

const routes = {
    '/': (
        <MainLayout>
            <MainPage />
        </MainLayout>
    ),
    '/electro': (
        <MainLayout>
            <ElectroCalcPage />
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

const Routes = () => {
    return <Router global routes={routes} />;
};

export default Routes;
