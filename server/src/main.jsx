import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the /client import
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalContextProvider } from 'src/context';

// Use React 18's createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));

// React 18 automatically batches state updates, so you no longer need React.StrictMode wrapping if you don't want it
root.render(
  <GlobalContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GlobalContextProvider>
);
