import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useLayoutGlobalLoader } from 'hooks/layouts/useLayoutGlobalLoader';
import { Link } from 'lib/Router';

import styles from './styles.module.scss';

interface IProps {
    children: React.ReactChild;
}

export const AuthLayout = observer(({ children }: IProps) => {
    useLayoutGlobalLoader();

    return (
        <>
            <div className={styles.wrap}>
                <header>
                    header <Link to="/">Main page</Link>
                </header>
                <div className={styles.main}>{children}</div>
                <footer>footer</footer>
            </div>
        </>
    );
});
