import { useState } from 'react'
import { resolveAssetPreview } from '../../lib/assetUrl'

type PublicationCoverProps = {
  coverImage?: string | null
  /** Usado para a inicial do fallback visual. */
  title: string
  /** Classes da tag <img>. O container (aspect-[16/9]) e sempre deste componente. */
  imageClassName?: string
  /** `lazy` (padrao, usado na listagem) ou `eager` (capa principal do detalhe). */
  imageLoading?: 'lazy' | 'eager'
  /**
   * O que renderizar quando a publicacao NAO tem capa cadastrada.
   * - `initial` (padrao): gradiente com a inicial do titulo — usado na listagem.
   * - `none`: nao renderiza nada — comportamento do detalhe.
   *
   * Em ERRO de carregamento (imagem quebrada) o gradiente e sempre aplicado,
   * porque uma imagem quebrada nunca deve aparecer para o visitante.
   */
  emptyFallback?: 'initial' | 'none'
}

/**
 * Capa de publicacao com resolucao de asset e fallback visual.
 *
 * - Caminho relativo (`/images/capa.jpg`): resolve com `import.meta.env.BASE_URL`
 *   (necessario no GitHub Pages, servido em `/Euqueroliber/`).
 * - URL absoluta (`https://...`): mantida intacta, nunca prefixada.
 * - Sem capa ou imagem quebrada: gradiente com a inicial do titulo.
 *
 * Nao altera o valor salvo no banco: o banco continua guardando o caminho cru.
 * A resolucao e exclusivamente de renderizacao.
 */
export function PublicationCover({
  coverImage,
  title,
  imageClassName,
  imageLoading = 'lazy',
  emptyFallback = 'initial',
}: PublicationCoverProps) {
  const [failed, setFailed] = useState(false)

  const initial = title.trim().charAt(0).toUpperCase() || '•'

  const renderFallback = () => {
    if (!coverImage && emptyFallback === 'none') return null

    return (
      <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,_#0F3A5F,_#14532D)]">
        <span className="text-4xl font-semibold text-[#F2B705]">{initial}</span>
      </div>
    )
  }

  if (!coverImage || failed) {
    return renderFallback()
  }

  return (
    <div className="aspect-[16/9] overflow-hidden">
      <img
        src={resolveAssetPreview(coverImage)}
        alt=""
        loading={imageLoading}
        onError={() => setFailed(true)}
        className={imageClassName}
      />
    </div>
  )
}
