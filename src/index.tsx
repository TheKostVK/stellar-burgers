import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);
const basename =
  process.env.NODE_ENV === 'production' ? '/stellar-burgers' : '/';

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        basename={basename}
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
      >
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
