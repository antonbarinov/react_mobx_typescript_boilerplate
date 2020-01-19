import React from 'react';
import { observer } from 'mobx-react-lite';

import styles from './styles.module.scss';

interface IProps {
    children?: React.ReactNode;
    innerRef?: React.Ref<HTMLDivElement>;
    htmlAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export const Container = observer((props: IProps) => {
    const { children, innerRef, htmlAttrs = {} } = props;

    return (
        <div className={styles.container} ref={innerRef} {...htmlAttrs}>
            {children}
        </div>
    );
});
