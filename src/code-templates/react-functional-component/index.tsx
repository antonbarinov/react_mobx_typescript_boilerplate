import React, { useState } from 'react';
import { MyExamplePropsState } from './state';

import styles from './styles.module.scss';

interface IMyExampleProps {
    children?: React.ReactNode;
    innerRef?: React.Ref<HTMLDivElement>;
    text?: string;
    htmlAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export const MyExample = (props: IMyExampleProps) => {
    const [state] = useState(() => new MyExamplePropsState());

    const { htmlAttrs = {}, text = 'world' } = props;

    return (
        <div className={styles.some_style} {...htmlAttrs}>
            <h1>
                Hello {text} {state.title}
            </h1>
            <input onChange={state.handleTitleChange} />
        </div>
    );
};
