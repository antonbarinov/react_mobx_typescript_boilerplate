import React from 'react';
import { observer } from 'mobx-react-lite';
import { WithBooleanFlag } from 'compositions/WithBooleanFlag';
import { getBool } from 'helpers/misc';

interface IIfProps {
    children: React.ReactNode;
    condition: WithBooleanFlag | boolean;
}
export const If = observer((props: IIfProps) => {
    const { children, condition } = props;
    if (!getBool(condition)) return null;

    return children as any;
});
