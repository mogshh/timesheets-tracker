import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App, { ROUTE_PARTS } from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    loader: () => {
      return redirect('/' + ROUTE_PARTS.timelines);
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
    path: '/:tabId/' + ROUTE_PARTS.create,
    element: <App />,
  },
  {
    path: '/:tabId/:id/' + ROUTE_PARTS.edit,
    element: <App />,
  },
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
