/**
 * Tipos do CMS institucional — ponte para o modulo compartilhado.
 *
 * Os shapes de conteudo foram movidos para `src/content/types.ts`, porque agora
 * sao consumidos tanto pelo painel administrativo quanto pelo site publico.
 * Este modulo mantem os imports internos do admin intactos e guarda apenas o
 * que e exclusivo do formulario administrativo.
 */

export * from '../../../content/types'

/** Props comuns aos formularios de conteudo do painel. */
export interface ContentFormProps<T> {
  value: T
  onChange: (next: T) => void
  disabled?: boolean
}
