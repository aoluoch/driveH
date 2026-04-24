import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Browse from './pages/Browse'
import CarDetail from './pages/CarDetail'
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'
import SavedCars from './pages/SavedCars'
import SellMyCar from './pages/SellMyCar'
import Finance from './pages/Finance'
import About from './pages/About'
import Contact from './pages/Contact'
import Guides from './pages/Guides'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/admin/Dashboard'
import CarForm from './pages/admin/CarForm'
import Messages from './pages/admin/Messages'
import Inquiries from './pages/admin/Inquiries'
import GuidesAdmin from './pages/admin/GuidesAdmin'
import GuideForm from './pages/admin/GuideForm'
import GuideDetail from './pages/GuideDetail'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Public user routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Browse />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/saved" element={<SavedCars />} />
      <Route path="/sell" element={<SellMyCar />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/guides/:id" element={<GuideDetail />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cars/add"
        element={
          <ProtectedRoute>
            <CarForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cars/:id/edit"
        element={
          <ProtectedRoute>
            <CarForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <ProtectedRoute>
            <Inquiries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/guides"
        element={
          <ProtectedRoute>
            <GuidesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/guides/add"
        element={
          <ProtectedRoute>
            <GuideForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/guides/:id/edit"
        element={
          <ProtectedRoute>
            <GuideForm />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
    </>
  )
}

export default App
