import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    loader: () => {
      return redirect('/timelines');
    },
  },
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/:tabId',
    element: <App />,
  },
  {
    path: '/:tabId/:action',
    element: <App />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
