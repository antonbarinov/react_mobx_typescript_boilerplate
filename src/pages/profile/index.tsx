import React from 'react';
import { Container } from 'components/Container';
import userState from 'globalState/user';

export const ProfilePage = () => {
    const { user } = userState;

    return (
        <Container>
            <h1>Profile</h1>
            <div>Name: {user.name}</div>
            <div>Login: {user.login}</div>
            <div>AccessToken: {user.accessToken}</div>
        </Container>
    );
};
