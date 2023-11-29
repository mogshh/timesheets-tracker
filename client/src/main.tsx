import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App, { ROUTE_PARTS } from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import TimelinesPage from './views/TimelinesPage/TimelinesPage';
import AutoTagsPage from './views/AutoTagsPage/AutoTagsPage';
import TagNamesPage from './views/TagNamesPage/TagNamesPage';
import EditAutoTagModal from './components/EditAutoTagModal/EditAutoTagModal';
import EditTagNameModal from './components/EditTagNameModal/EditTagNameModal';
import { routes } from './routes';

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

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
  },
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
