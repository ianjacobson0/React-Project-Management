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
import EditProjectPage from '../EditProjectPage/EditProjectPage';
import EditOrgPage from '../EditOrgPage/EditOrgPage';
import InviteOrgPage from '../InviteOrgPage/InviteOrgPage';
import JoinOrgPage from '../JoinOrgPage/JoinOrgPage';

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
          <Route element={<LayoutWithBg />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/createorg" element={<CreateOrgPage />} />
            <Route path="/createproject" element={<CreateProjectPage />} />
            <Route path="/editproject" element={<EditProjectPage />} />
            <Route path="/editorganization" element={<EditOrgPage />} />
            <Route path="/inviteorganization" element={<InviteOrgPage />} />
            <Route path="/join" element={<JoinOrgPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
