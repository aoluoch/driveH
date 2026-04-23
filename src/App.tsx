import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import CarForm from './pages/admin/CarForm'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/cars/:id" element={<CarDetail />} />

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
