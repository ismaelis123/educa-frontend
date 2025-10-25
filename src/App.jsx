import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import VendorDashboard from './pages/VendorDashboard';
import CreateCourse from './pages/CreateCourse';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Layout><Courses /></Layout>} />
          <Route path="/course/:id" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/vendor/dashboard" element={<Layout><VendorDashboard /></Layout>} />
          <Route path="/vendor/create-course" element={<Layout><CreateCourse /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;