import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'config/mobxConfig';

const buildDate = new Date(process.env.buildTime);
console.log('build time', buildDate.toLocaleDateString() + ' ' + buildDate.toLocaleTimeString());

import App from './App';

import 'index.scss';

ReactDOM.render(<App />, document.getElementById('root'));
