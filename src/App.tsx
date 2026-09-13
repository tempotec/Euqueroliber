import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ComoTrabalhamos } from './components/sections/ComoTrabalhamos'
import { Contato } from './components/sections/Contato'
import { Hero } from './components/sections/Hero'
import { QuemSomos } from './components/sections/QuemSomos'
import { Solucoes } from './components/sections/Solucoes'
import { useLenis } from './hooks/useLenis'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPublicationFormPage } from './pages/AdminPublicationFormPage'
import { AdminPublicationsPage } from './pages/AdminPublicationsPage'
import { PublicacaoDetailPage } from './pages/PublicacaoDetailPage'
import { ParceirosPage } from './pages/ParceirosPage'
import { PublicacoesPage } from './pages/PublicacoesPage'
import { ProjetosClientesPage } from './pages/ProjetosClientesPage'

function HomePage() {
  return <Hero />
}

function QuemSomosPage() {
  return <QuemSomos />
}

function SolucoesPage() {
  return <><Solucoes /><ComoTrabalhamos /></>
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  useLenis()

  return (
    <Routes>
      <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quem-somos" element={<QuemSomosPage />} />
          <Route path="/solucoes" element={<SolucoesPage />} />
          <Route path="/projetos" element={<ProjetosClientesPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/publicacoes" element={<PublicacoesPage />} />
          <Route path="/publicacoes/:slug" element={<PublicacaoDetailPage />} />
          <Route path="/contato" element={<Contato />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={(
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/publicacoes"
        element={(
          <ProtectedRoute>
            <AdminPublicationsPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/publicacoes/nova"
        element={(
          <ProtectedRoute>
            <AdminPublicationFormPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/publicacoes/:id/editar"
        element={(
          <ProtectedRoute>
            <AdminPublicationFormPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  )
}

export default App
