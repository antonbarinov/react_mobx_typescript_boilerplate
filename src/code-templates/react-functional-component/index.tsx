import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLocalState } from 'hooks/useLocalState';
import { MyExamplePropsState } from './state';

import styles from './styles.module.scss';

interface IMyExampleProps {
    children?: React.ReactNode;
    innerRef?: React.Ref<HTMLDivElement>;
    text?: string;
    htmlAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

const MyExample = observer((props: IMyExampleProps) => {
    const state = useLocalState(MyExamplePropsState);

    const { htmlAttrs = {}, text = 'world' } = props;

    return (
        <div className={styles.some_style} {...htmlAttrs}>
            <h1>
                Hello {text} {state.title}
            </h1>
            <input onChange={state.handleTitleChange} />
        </div>
    );
});

export default MyExample;
