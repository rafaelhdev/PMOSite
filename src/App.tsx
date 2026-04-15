import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import CollaboratorList from './pages/CollaboratorList'
import CollaboratorRegister from './pages/CollaboratorRegister'
import CollaboratorProfile from './pages/CollaboratorProfile'
import VacationManagement from './pages/VacationManagement'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas — requerem sessão ativa */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/collaborators" element={<CollaboratorList />} />
                      <Route path="/collaborators/new" element={<CollaboratorRegister />} />
                      <Route path="/collaborators/:id" element={<CollaboratorProfile />} />
                      <Route path="/vacations" element={<VacationManagement />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
