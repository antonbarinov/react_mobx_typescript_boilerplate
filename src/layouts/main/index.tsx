import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useLayoutGlobalLoader } from 'hooks/layouts/useLayoutGlobalLoader';
import { redirect, Link } from 'lib/Router';
import userState from 'globalState/user';

import styles from './styles.module.scss';

interface IProps {
    children: React.ReactChild;
    privateRoute?: boolean;
}

function usePrivateRouteHandler(props: IProps) {
    const redirectChecker = useCallback(() => {
        const { privateRoute } = props;
        const { initialFetching, authorized } = userState;
        const doRedirect = (initialFetching || authorized) === false;

        if (privateRoute && doRedirect) {
            window.localStorage.setItem('redirect', window.location.pathname + window.location.search + window.location.hash);
            redirect('/login');
        }
    }, []);

    redirectChecker();
}

export const MainLayout = observer((props: IProps) => {
    const { children, privateRoute } = props;
    const { initialFetching, authorized } = userState;

    useLayoutGlobalLoader();
    // Redirect on private route and user not authorized
    usePrivateRouteHandler(props);

    if (initialFetching) return null;
    if (privateRoute && authorized === false) return null;

    return (
        <>
            <div className={styles.wrap}>
                <header>
                    header
                    {authorized && <button onClick={userState.logout}>Logout</button>}
                    {authorized === false && (
                        <>
                            &nbsp;&nbsp;
                            <Link to="/login">Login</Link>
                            &nbsp;&nbsp;
                            <Link to="/signup">Signup</Link>
                        </>
                    )}
                </header>
                <div className={styles.main}>{children}</div>
                <footer>footer</footer>
            </div>
        </>
    );
});
