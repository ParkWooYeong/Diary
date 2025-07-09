import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App      from './App.jsx';
import Signup   from './looks/Signup.jsx';
import Login    from './looks/Login.jsx';
import List     from './looks/List.jsx';
import Form     from './looks/Form.jsx';
import DiaryEntry from './looks/DiaryEntry.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,    // 여기서 <App> 안에 <Outlet/> 이 있고,
    children: [          // 그 자식으로 페이지들이 들어갑니다.
      { index: true,       element: <List /> },
      { path: 'signup',    element: <Signup /> },
      { path: 'login',     element: <Login /> },
      { path: 'notes/new', element: <Form /> },
      { path: 'notes/:id', element: <Form /> },
      { path: 'notes/:id',         element: <DiaryEntry /> },
      { path: 'notes/:id/edit',    element: <Form /> },
      { path: '*',         element: <Navigate to="/" replace /> },
    ]
  }
]);

export default router;
