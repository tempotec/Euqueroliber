/**
 * Resolucao de caminhos de imagem para exibicao de miniatura no painel.
 *
 * O valor ARMAZENADO no CMS permanece o caminho cru (ex.: "/images/hero-reciclagem.jpg"),
 * do mesmo jeito que o site publico guarda nos arquivos .ts — o site aplica o BASE_URL
 * ao renderizar. Aqui a resolucao existe apenas para a previa do painel funcionar
 * tambem quando o app e servido sob um base path (ex.: /Euqueroliber/).
 */

const BASE_URL = import.meta.env.BASE_URL

export function resolveAssetPreview(value: string): string {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return ''
  }

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed
  }

  return `${BASE_URL}${trimmed.replace(/^\/+/, '')}`
}
