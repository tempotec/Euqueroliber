import { Handshake } from 'lucide-react'
import { siteContent } from '../../content/site'
import { usePublishedSection } from '../../content/publicContentContext'

/**
 * Conteudo do rodape vindo do CMS (draft_data de `footer`).
 *
 * Apenas `message` e editavel. `brand` e `rights` (copyright/ano) continuam vindo de
 * site.ts: o ano permanece dinamico e NAO faz parte do conteudo do CMS.
 */
export interface FooterSectionContent {
  message: string
}

interface FooterProps {
  content?: FooterSectionContent
}

export function Footer({ content }: FooterProps) {
  // Mesma fonte de marca do Header/Hero. `rights` continua dinamico em site.ts.
  const home = usePublishedSection('home')
  const brand = home?.brand ?? siteContent.brand
  // No preview vale o rascunho (`content`); no site publico, o `published_data`.
  const publishedFooter = usePublishedSection('footer')
  const message =
    content?.message ?? publishedFooter?.message ?? siteContent.footer.message

  return (
    <footer className="border-t border-[#F2B705]/20 bg-[#082F49] text-[#F7F3E8]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 md:px-8 md:py-12">
        <div className="inline-flex items-center gap-2 text-[#F2B705]">
          <Handshake size={18} />
          <span className="text-xs uppercase tracking-[0.16em]">{brand}</span>
        </div>
        <p className="max-w-4xl text-sm leading-relaxed text-[#F7F3E8]/85 md:text-base">{message}</p>
        <p className="text-xs text-[#F7F3E8]/65">{siteContent.footer.rights}</p>
      </div>
    </footer>
  )
}
