import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';


import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';

import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/route/ProtectedRoute';

import { loadUser } from './actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/layout/Loader';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const { user = {}, isAuthenticated, loading } = useSelector((state) => state?.auth);
  console.log("test from app.js user, isAuthenticated, Loading", user, isAuthenticated, loading);

  if (loading) return <Loader />;

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            {/* Public Routes */}

            <Route path="/" element={<Login />} exact />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<NewPassword />} />


            {/* Protected Routes */}
            <Route
              path="/me"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/me/update"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/password/update"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAdmin={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {!loading && (!isAuthenticated || user.role !== 'admin') && <Footer />}
      </div>
    </Router>
  );
}

export default App;
