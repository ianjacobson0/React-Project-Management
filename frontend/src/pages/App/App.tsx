import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../LoginPage/LoginPage';
import HomePage from '../HomePage/HomePage';
import PrivateRoutes from '../../components/PrivateRoutes/PrivateRoutes';
import RegisterPage from '../RegisterPage/RegisterPage';
import { Box } from '@mui/material';
import CreateOrgPage from '../CreateOrgPage/CreateOrgPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import LayoutWithBg from '../../layouts/LayoutWithBg/LayoutWithBg';
import CreateProjectPage from '../CreateProjectPage/CreateProjectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutWithBg />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/error" element={<ErrorPage />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<LayoutWithBg />}>
            <Route path="/createorg" element={<CreateOrgPage />} />
            <Route path="/createproject" element={<CreateProjectPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
