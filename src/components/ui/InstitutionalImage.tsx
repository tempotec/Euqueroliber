import type { CSSProperties } from 'react'
import type { InstitutionalImage as InstitutionalImageConfig } from '../../content/homeImages'
import { ImageMockBadge } from './ImageMockBadge'

type InstitutionalImageProps = {
  image: InstitutionalImageConfig
  figureClassName: string
  imgClassName?: string
  badgeClassName?: string
}

export function InstitutionalImage({ image, figureClassName, imgClassName, badgeClassName }: InstitutionalImageProps) {
  const style: CSSProperties | undefined = image.objectPosition ? { objectPosition: image.objectPosition } : undefined

  return (
    <figure className={figureClassName}>
      <img
        src={image.src}
        alt={image.alt}
        srcSet={image.srcSet}
        sizes={image.sizes}
        loading={image.loading ?? 'lazy'}
        decoding="async"
        width={image.width}
        height={image.height}
        className={['h-full w-full object-cover', imgClassName].filter(Boolean).join(' ')}
        style={style}
      />
      {image.badge && <ImageMockBadge label={image.badge} className={badgeClassName} />}
    </figure>
  )
}
