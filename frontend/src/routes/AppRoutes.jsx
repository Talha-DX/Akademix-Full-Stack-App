import { Routes, Route } from 'react-router-dom'

import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import NotFound from '../pages/public/NotFound'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import TwoFactorAuth from '../pages/auth/TwoFactorAuth'

import AdminDashboard from '../pages/admin/Dashboard/AdminDashboard'
import TeacherDashboard from '../pages/teacher/Dashboard/TeacherDashboard'
import StudentDashboard from '../pages/student/Dashboard/StudentDashboard'
import RoleRoute from './RoleRoute'

/**
 * Each role dashboard owns its own internal module switching (see its
 * Dashboard/*.jsx), so it only needs a single route per role here, plus a
 * /:section param so deep links / refreshes land on the right module.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/two-factor" element={<TwoFactorAuth />} />

      <Route path="/admin/*" element={<RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
      <Route path="/teacher/*" element={<RoleRoute roles={['TEACHER']}><TeacherDashboard /></RoleRoute>} />
      <Route path="/student/*" element={<RoleRoute roles={['STUDENT']}><StudentDashboard /></RoleRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
