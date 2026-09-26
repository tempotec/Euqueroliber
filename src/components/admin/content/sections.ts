import type { ContentSectionKey } from '../../../lib/api'

export interface AdminContentSectionMeta {
  key: ContentSectionKey
  name: string
  description: string
}

/**
 * As 8 seções do CMS são fixas. Não existe criação de novas seções pelo painel:
 * a lista abaixo é a única fonte de verdade da área "Conteúdo do site".
 */
export const ADMIN_CONTENT_SECTIONS: AdminContentSectionMeta[] = [
  {
    key: 'home',
    name: 'Home',
    description: 'Marca e destaque principal da página inicial (inclui o Hero).',
  },
  {
    key: 'quem_somos',
    name: 'Quem Somos',
    description: 'Título, abertura, história e atuação.',
  },
  {
    key: 'solucoes',
    name: 'Soluções',
    description: 'Soluções apresentadas no site, com detalhes, imagens e chamadas.',
  },
  {
    key: 'processo',
    name: 'Como Trabalhamos',
    description: 'Etapas do processo de trabalho.',
  },
  {
    key: 'projetos',
    name: 'Projetos',
    description: 'Projetos exibidos na página, com imagens e chamada final.',
  },
  {
    key: 'parceiros',
    name: 'Parceiros',
    description: 'Lista de parceiros e logos.',
  },
  {
    key: 'contato',
    name: 'Contato',
    description: 'Textos do formulário de contato e mensagens de retorno.',
  },
  {
    key: 'footer',
    name: 'Rodapé',
    description: 'Mensagem institucional do rodapé.',
  },
]

export function getContentSectionMeta(key: string): AdminContentSectionMeta | null {
  return ADMIN_CONTENT_SECTIONS.find((section) => section.key === key) ?? null
}

export function isContentSectionKey(value: string): value is ContentSectionKey {
  return ADMIN_CONTENT_SECTIONS.some((section) => section.key === value)
}

export function formatAdminDate(value: string | null): string {
  if (!value) {
    return 'Nunca'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return 'Data indisponível'
  }

  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
