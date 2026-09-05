import { ArrowRight } from 'lucide-react'
import { HashRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ComoTrabalhamos } from './components/sections/ComoTrabalhamos'
import { Contato } from './components/sections/Contato'
import { Diferenciais } from './components/sections/Diferenciais'
import { Hero } from './components/sections/Hero'
import { Impacto } from './components/sections/Impacto'
import { Proposito } from './components/sections/Proposito'
import { QuemSomos } from './components/sections/QuemSomos'
import { Solucoes } from './components/sections/Solucoes'
import { Section } from './components/ui/Section'
import { useLenis } from './hooks/useLenis'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPublicationFormPage } from './pages/AdminPublicationFormPage'
import { AdminPublicationsPage } from './pages/AdminPublicationsPage'
import { PublicacaoDetailPage } from './pages/PublicacaoDetailPage'
import { PublicacoesPage } from './pages/PublicacoesPage'
import { ProjetosTimeline } from './components/sections/ProjetosTimeline'

function HomePage() {
  return <Hero />
}

function QuemSomosPage() {
  return (
    <>
      <QuemSomos />
      <Proposito />
      <Diferenciais />
      <Section id="quem-somos-cta" className="bg-[#FBF8EF]">
        <div className="flex flex-col items-start gap-5 rounded-lg border border-[#F2B705]/40 bg-gradient-to-br from-white to-[#FBF8EF] p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-[#14532D] md:text-3xl">
              Conheça nossas soluções
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#374151] md:text-base">
              Da gestão de resíduos à inclusão produtiva, veja como transformamos desafios em oportunidades.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              to="/solucoes"
              className="inline-flex items-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166534]"
            >
              Conheça nossas soluções
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-lg border border-[#14532D] px-5 py-3 text-sm font-semibold text-[#14532D] transition hover:bg-[#14532D] hover:text-white"
            >
              Fale com a gente
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
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
          <Route path="/impacto" element={<Impacto />} />
          <Route path="/projetos-clientes" element={<ProjetosTimeline />} />
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
