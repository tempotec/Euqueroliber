type ImageMockBadgeProps = {
  className?: string
  label?: string
}

export function ImageMockBadge({ className, label = 'Imagem provisória' }: ImageMockBadgeProps) {
  return (
    <span
      className={`absolute right-3 top-3 rounded-md bg-[#111827]/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white shadow-sm ${className ?? ''}`}
    >
      {label}
    </span>
  )
}
