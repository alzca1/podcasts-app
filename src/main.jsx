import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Podcast from './routes/Podcast';
import Layout from './components/Layout';
import Error from './routes/Error';
import Home from './routes/Home';
import Episode from './routes/Episode';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'podcast/:podcastId',
        element: <Podcast />,
        children: [
          {
            path: 'episode/:episodeId',
            element: <Episode />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
