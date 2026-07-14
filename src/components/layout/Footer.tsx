import { Handshake } from 'lucide-react'
import { siteContent } from '../../content/site'

export function Footer() {
  return (
    <footer className="border-t border-[#F2B705]/20 bg-[#082F49] text-[#F7F3E8]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 md:px-8 md:py-12">
        <div className="inline-flex items-center gap-2 text-[#F2B705]">
          <Handshake size={18} />
          <span className="text-xs uppercase tracking-[0.16em]">Presença digital em construção</span>
        </div>
        <p className="max-w-4xl text-sm leading-relaxed text-[#F7F3E8]/85 md:text-base">{siteContent.footer.message}</p>
        <p className="text-xs text-[#F7F3E8]/65">{siteContent.footer.rights}</p>
      </div>
    </footer>
  )
}
