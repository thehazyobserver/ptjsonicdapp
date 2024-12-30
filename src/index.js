import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';

const App = lazy(() => import('./App')); // Lazy load the App component
const reportWebVitals = lazy(() => import('./reportWebVitals')); // Lazy load web vitals

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);

// Dynamically log web vitals
reportWebVitals().then((module) => {
  module.default(console.log);
});
