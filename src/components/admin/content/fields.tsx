import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { appendAt, moveAt, removeAt, replaceAt } from './arrayUtils'
import { resolveAssetPreview } from './assetUrl'
import { cardClass, controlClass, hintClass, labelClass, smallButtonClass } from './styles'

interface FieldShellProps {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
  readOnly?: boolean
}

export function FieldShell({ label, hint, htmlFor, children, readOnly }: FieldShellProps) {
  return (
    <div className="space-y-2">
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
        {readOnly ? (
          <span className="ml-2 rounded-full bg-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            técnico
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className={hintClass}>{hint}</p> : null}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
  placeholder?: string
  disabled?: boolean
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  disabled,
}: TextFieldProps) {
  const id = useId()

  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="text"
        className={controlClass}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  rows = 3,
  disabled,
}: TextAreaFieldProps) {
  const id = useId()

  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        className={`${controlClass} resize-y`}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  )
}

interface ImageUrlFieldProps {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
  disabled?: boolean
  optional?: boolean
}

/**
 * Upload não existe neste ticket: a imagem é editada como caminho/URL textual.
 * Uma miniatura é exibida quando o caminho aponta para um arquivo válido.
 */
export function ImageUrlField({
  label,
  value,
  onChange,
  hint,
  disabled,
  optional,
}: ImageUrlFieldProps) {
  const id = useId()
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const previewSrc = resolveAssetPreview(value)
  // Guardar o src que falhou (em vez de um booleano) faz a previa se recuperar
  // sozinha quando o caminho muda — sem estado travado apos uma falha transitoria.
  const canPreview = previewSrc.length > 0 && previewSrc !== failedSrc

  return (
    <FieldShell
      label={label}
      hint={hint ?? 'Caminho ou URL da imagem (ex.: /images/hero-reciclagem.jpg).'}
      htmlFor={id}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <input
          id={id}
          type="text"
          className={controlClass}
          value={value}
          placeholder={optional ? '(opcional) /images/arquivo.jpg' : '/images/arquivo.jpg'}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        {value.trim().length > 0 ? (
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {canPreview ? (
              <img
                src={previewSrc}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setFailedSrc(previewSrc)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-[var(--muted)]">
                sem prévia
              </span>
            )}
          </div>
        ) : null}
      </div>
    </FieldShell>
  )
}

interface TechnicalNoteProps {
  children: ReactNode
}

export function TechnicalNote({ children }: TechnicalNoteProps) {
  return (
    <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-warm)] px-4 py-3 text-xs text-[var(--muted)]">
      {children}
    </p>
  )
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className={cardClass}>
      <header className="mb-4">
        <h3 className="text-base font-semibold text-[var(--blue-deep)]">{title}</h3>
        {description ? <p className={hintClass}>{description}</p> : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

interface RowControlsProps {
  index: number
  total: number
  onMove: (offset: number) => void
  onRemove: () => void
  disabled?: boolean
  removeLabel?: string
}

function RowControls({
  index,
  total,
  onMove,
  onRemove,
  disabled,
  removeLabel = 'Remover',
}: RowControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={smallButtonClass}
        onClick={() => onMove(-1)}
        disabled={disabled || index === 0}
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        Mover para cima
      </button>
      <button
        type="button"
        className={smallButtonClass}
        onClick={() => onMove(1)}
        disabled={disabled || index === total - 1}
      >
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        Mover para baixo
      </button>
      <button
        type="button"
        className={`${smallButtonClass} hover:border-[var(--amber)] hover:text-[var(--amber)]`}
        onClick={onRemove}
        disabled={disabled}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        {removeLabel}
      </button>
    </div>
  )
}

interface StringListEditorProps {
  label: string
  items: string[]
  onChange: (next: string[]) => void
  hint?: string
  addLabel?: string
  itemLabel?: string
  placeholder?: string
  disabled?: boolean
}

export function StringListEditor({
  label,
  items,
  onChange,
  hint,
  addLabel = 'Adicionar item',
  itemLabel = 'Item',
  placeholder,
  disabled,
}: StringListEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <span className={labelClass}>{label}</span>
        {hint ? <p className={hintClass}>{hint}</p> : null}
      </div>

      {items.length === 0 ? (
        <p className={hintClass}>Nenhum item cadastrado.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={`${label}-${index}`} className={cardClass}>
              <div className="space-y-2">
                <FieldShell label={`${itemLabel} ${index + 1}`}>
                  <textarea
                    className={`${controlClass} resize-y`}
                    value={item}
                    rows={2}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(event) =>
                      onChange(replaceAt(items, index, event.target.value))
                    }
                  />
                </FieldShell>
                <RowControls
                  index={index}
                  total={items.length}
                  disabled={disabled}
                  onMove={(offset) => onChange(moveAt(items, index, offset))}
                  onRemove={() => onChange(removeAt(items, index))}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className={smallButtonClass}
        onClick={() => onChange(appendAt(items, ''))}
        disabled={disabled}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  )
}

interface ObjectListEditorProps<T> {
  label: string
  items: T[]
  onChange: (next: T[]) => void
  createItem: () => T
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode
  hint?: string
  addLabel?: string
  itemTitle?: (item: T, index: number) => string
  disabled?: boolean
}

export function ObjectListEditor<T>({
  label,
  items,
  onChange,
  createItem,
  renderItem,
  hint,
  addLabel = 'Adicionar',
  itemTitle,
  disabled,
}: ObjectListEditorProps<T>) {
  return (
    <div className="space-y-3">
      <div>
        <span className={labelClass}>{label}</span>
        {hint ? <p className={hintClass}>{hint}</p> : null}
      </div>

      {items.length === 0 ? (
        <p className={hintClass}>Nenhum item cadastrado.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={`${label}-${index}`} className={cardClass}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--blue)]">
                    {itemTitle ? itemTitle(item, index) : `${label} ${index + 1}`}
                  </p>
                  <RowControls
                    index={index}
                    total={items.length}
                    disabled={disabled}
                    onMove={(offset) => onChange(moveAt(items, index, offset))}
                    onRemove={() => onChange(removeAt(items, index))}
                  />
                </div>
                <div className="space-y-4">
                  {renderItem(item, (next) => onChange(replaceAt(items, index, next)), index)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className={smallButtonClass}
        onClick={() => onChange(appendAt(items, createItem()))}
        disabled={disabled}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  )
}
