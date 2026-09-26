/**
 * Classes compartilhadas dos campos do CMS.
 * Ficam em arquivo .ts para nao misturar constantes com componentes
 * (regra react-refresh/only-export-components).
 */

export const controlClass =
  'w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm transition focus:border-[var(--blue)] disabled:cursor-not-allowed disabled:bg-[var(--surface-warm)] disabled:text-[var(--muted)]'

export const labelClass = 'block text-sm font-semibold text-[var(--ink)]'

export const hintClass = 'mt-1 text-xs text-[var(--muted)]'

export const cardClass =
  'rounded-2xl border border-[var(--border)] bg-[var(--surface-warm)] p-4 sm:p-5'

export const smallButtonClass =
  'inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--blue)] hover:text-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-50'
