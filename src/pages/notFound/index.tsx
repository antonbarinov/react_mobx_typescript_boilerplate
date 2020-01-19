import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'lib/router';

import styles from './styles.module.scss';

export const NotFoundPage = observer(() => {
    return (
        <div>
            <h1 className={styles.h1}>OOOPS Page not found</h1>
            <Link to="/">Go to main page</Link>
        </div>
    );
});
