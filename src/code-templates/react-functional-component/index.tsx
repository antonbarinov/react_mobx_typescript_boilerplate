import React from 'react';
import { observer } from 'mobx-react-lite';
import { FCState } from './state';

import styles from './styles.module.scss';
import { useLocalState } from 'hooks/useLocalState';

interface IProps {
    children?: React.ReactNode;
    innerRef?: React.Ref<HTMLDivElement>;
    text?: string;
    htmlAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export const FC = observer((props: IProps) => {
    const state = useLocalState(FCState);

    const { htmlAttrs = {}, text = 'world' } = props;

    return (
        <div className={styles.some_style} {...htmlAttrs}>
            <h1>Hello {text}</h1>
        </div>
    );
});
