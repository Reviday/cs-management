import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/es/object';
import 'es7-object-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import App from 'App';
import ContextComposer from 'react-context-composer';
import { UserInfoProvider } from 'contexts/UserInfoContext';
import { CollapseProvider } from 'contexts/CollapseContext';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <ContextComposer contexts={[
      <UserInfoProvider />,
      <CollapseProvider />,
    ]}
    >
      <App />
    </ContextComposer>
  </Router>,
  document.getElementById('root')
);
