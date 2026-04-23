import { Route, Routes } from 'react-router-dom'
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
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import CarForm from './pages/admin/CarForm'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
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
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<Login />} />

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

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
