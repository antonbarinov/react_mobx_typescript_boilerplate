import * as React from 'react';
import { Link } from 'lib/Router';

import styles from './styles.module.scss';

export const NotFoundPage = () => {
    return (
        <div>
            <h1 className={styles.h1}>OOOPS Page not found</h1>
            <Link to="/">Go to main page</Link>
        </div>
    );
};
