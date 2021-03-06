import * as React from 'react';
import { observer } from 'mobx-react';

const wrappedComponentsSet = new WeakSet();
const wrappedComponentsMap = new WeakMap();

// @ts-ignore
const createElement = React.createElement;
// @ts-ignore
React.createElement = function() {
    const target = arguments[0];
    if (typeof target === 'function' && !wrappedComponentsSet.has(target)) {
        if (target.prototype.shouldComponentUpdate) {
            delete target.prototype.shouldComponentUpdate;
        }

        wrappedComponentsSet.add(target);
        const wrapped = observer(target);
        arguments[0] = wrapped;
        wrappedComponentsMap.set(target, wrapped);
    } else if (wrappedComponentsSet.has(target)) {
        arguments[0] = wrappedComponentsMap.get(target) || observer(target);
    }
    return createElement.apply(this, arguments);
};
