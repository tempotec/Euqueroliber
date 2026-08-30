import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ComoTrabalhamos } from './components/sections/ComoTrabalhamos'
import { Contato } from './components/sections/Contato'
import { Diferenciais } from './components/sections/Diferenciais'
import { Hero } from './components/sections/Hero'
import { Impacto } from './components/sections/Impacto'
import { ProjetosTimeline } from './components/sections/ProjetosTimeline'
import { Proposito } from './components/sections/Proposito'
import { QuemSomos } from './components/sections/QuemSomos'
import { Solucoes } from './components/sections/Solucoes'
import { Section } from './components/ui/Section'
import { useLenis } from './hooks/useLenis'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'

function HomePage() {
  return <Hero />
}

function QuemSomosPage() {
  return <><QuemSomos /><Proposito /><Diferenciais /></>
}

function SolucoesPage() {
  return <><Solucoes /><ComoTrabalhamos /></>
}

function PublicacoesPage() {
  return (
    <Section id="publicacoes" className="bg-[#F7F3E8]">
      <div className="max-w-3xl">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#D97706]">Em construção</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-normal text-[#111827] md:text-4xl">Publicações</h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-[#374151]">Conteúdos, materiais e novidades serão publicados aqui.</p>
      </div>
    </Section>
  )
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
          <Route path="/impacto" element={<Impacto />} />
          <Route path="/projetos-clientes" element={<ProjetosTimeline />} />
          <Route path="/publicacoes" element={<PublicacoesPage />} />
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
