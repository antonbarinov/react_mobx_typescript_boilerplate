import React, { useState } from 'react';
import { MyComponentsState } from './state';

import styles from './styles.module.scss';

interface IMyComponentProps {
    children?: React.ReactNode;
    innerRef?: React.Ref<HTMLDivElement>;
    text?: string;
    htmlAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export const MyComponent = (props: IMyComponentProps) => {
    const [state] = useState(() => new MyComponentsState());

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
