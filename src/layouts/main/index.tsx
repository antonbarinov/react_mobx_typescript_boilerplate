import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useLayoutGlobalLoader } from 'hooks/layouts/useLayoutGlobalLoader';

import userState from 'globalState/user';

import styles from './styles.module.scss';

interface IProps {
    children: React.ReactChild;
}

const MainLayout = observer(({ children }: IProps) => {
    useLayoutGlobalLoader();

    const { initialFetching } = userState;
    if (initialFetching) return null;

    return (
        <>
            <div className={styles.wrap}>
                <header>header</header>
                <div className={styles.main}>{children}</div>
                <footer>footer</footer>
            </div>
        </>
    );
});

export default MainLayout;
