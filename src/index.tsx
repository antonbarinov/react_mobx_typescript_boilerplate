import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure } from 'mobx';

import App from './App';

import 'index.scss';

ReactDOM.render(<App />, document.getElementById('root'));

// Configure MobX to auto batch all sync mutations without using action/runInAction
setTimeout(() => {
    configure({
        reactionScheduler: (f) => {
            setTimeout(f, 0);
        },
    });
}, 0);
