import { Routes, Route } from 'react-router-dom'

import Home from '../pages/public/Home'
import Features from '../pages/public/Features'
import Pricing from '../pages/public/Pricing'
import About from '../pages/public/About'
import Testimonials from '../pages/public/Testimonials'
import FAQ from '../pages/public/FAQ'
import Contact from '../pages/public/Contact'
import Privacy from '../pages/public/Privacy'
import Terms from '../pages/public/Terms'
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
 * Dashboard/*.jsx), with an optional section parameter for deep links.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/two-factor" element={<TwoFactorAuth />} />

      <Route path="/admin/:section?" element={<RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
      <Route path="/teacher/:section?" element={<RoleRoute roles={['TEACHER']}><TeacherDashboard /></RoleRoute>} />
      <Route path="/student/:section?" element={<RoleRoute roles={['STUDENT']}><StudentDashboard /></RoleRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
