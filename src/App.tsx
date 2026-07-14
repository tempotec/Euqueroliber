import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ComoTrabalhamos } from './components/sections/ComoTrabalhamos'
import { Contato } from './components/sections/Contato'
import { Diferenciais } from './components/sections/Diferenciais'
import { Hero } from './components/sections/Hero'
import { Impacto } from './components/sections/Impacto'
import { Parceiros } from './components/sections/Parceiros'
import { ProjetosTimeline } from './components/sections/ProjetosTimeline'
import { Proposito } from './components/sections/Proposito'
import { QuemSomos } from './components/sections/QuemSomos'
import { Solucoes } from './components/sections/Solucoes'
import { useLenis } from './hooks/useLenis'

function App() {
  useLenis()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
      <Header />
      <main>
        <Hero />
        <QuemSomos />
        <Proposito />
        <Solucoes />
        <ComoTrabalhamos />
        <ProjetosTimeline />
        <Impacto />
        <Diferenciais />
        <Parceiros />
        <Contato />
      </main>
      <Footer />
    </div>
  )
}

export default App
