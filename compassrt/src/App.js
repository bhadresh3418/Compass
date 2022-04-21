import React from 'react';
import Router from './Router';
import {store} from './redux/store';
import {Provider} from 'react-redux';

import './assets/scss/main.scss';

function App() {
  return (
    <Provider store={store} >
      <Router />
    </Provider>
  );
}

export default App;
