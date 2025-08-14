import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App        from './App.jsx';
import Signup     from './looks/Signup.jsx';
import Login      from './looks/Login.jsx';
import List       from './looks/List.jsx';
import Form       from './looks/Form.jsx';
import DiaryEntry from './looks/DiaryEntry.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,      // App 안에 <Outlet />
    children: [
      // ✅ 로그인 필요: 홈(목록)
      {
        index: true,
        element: (
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        ),
      },

      // ✅ 로그인 필요: 글 작성/수정/상세
      {
        path: 'notes/new',
        element: (
          <ProtectedRoute>
            <Form />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes/:id/edit',
        element: (
          <ProtectedRoute>
            <Form />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes/:id',
        element: (
          <ProtectedRoute>
            <DiaryEntry />
          </ProtectedRoute>
        ),
      },

      // ❌ 로그인 불필요: 로그인/회원가입
      { path: 'login',  element: <Login /> },
      { path: 'signup', element: <Signup /> },

      // 나머지는 홈으로
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
