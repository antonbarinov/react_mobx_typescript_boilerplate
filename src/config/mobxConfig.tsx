import * as React from 'react';
import { observer } from 'mobx-react';
import { configure } from 'mobx';

const wrappedComponentsSet = new WeakSet();
const wrappedComponentsMap = new WeakMap();

let inputChanged = false;
let inputChangedTimeout = null;

// @ts-ignore
const createElement = React.createElement;
// @ts-ignore
React.createElement = function() {
    const [target, props] = arguments;

    if (target === 'input' || target === 'textarea') {
        if (props?.onChange) {
            const changeFn = props.onChange;
            props.onChange = (...args) => {
                inputChanged = true;

                clearTimeout(inputChangedTimeout);
                setTimeout(() => {
                    inputChanged = false;
                });

                changeFn(...args);
            }
        }
    }

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
    return createElement(ErrorBoundary, {}, createElement.apply(this, arguments));
};

class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.error(error, info);
    }

    render() {
        const { hasError } = this.state;
        if (hasError) {
            // You can render any custom fallback UI
            return <b style={{ color: 'red', textDecoration: 'underline' }}>Something went wrong.</b>;
        }
        return this.props.children;
    }
}

let reactionSchedulerTimeout = null;

// Configure MobX to auto batch all sync mutations without using action/runInAction
setTimeout(() => {
    configure({
        reactionScheduler: (f) => {
            if (inputChanged) {
                f();
            } else {
                clearTimeout(reactionSchedulerTimeout);

                reactionSchedulerTimeout = setTimeout(f);
            }
        },
    });
}, 1);
