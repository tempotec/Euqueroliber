import { ApiError } from '../../../lib/api'

/**
 * Tradução das falhas de API do CMS em mensagens amigáveis.
 * Nunca expõe stack trace nem detalhes internos do servidor.
 */
export function getContentErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'invalid_content_key':
        return 'Conteúdo inexistente para esta seção.'
      case 'not_found':
        return 'Seção de conteúdo não encontrada.'
      case 'validation_error':
        return 'Não foi possível salvar: os dados enviados são inválidos.'
      case 'persistence_error':
        return 'Não foi possível salvar no banco de dados.'
      case 'server_unavailable':
        return 'Não foi possível conectar ao servidor.'
      default:
        break
    }

    if (error.status === 401) {
      return 'Sua sessão expirou. Faça login novamente.'
    }

    if (error.status === 404) {
      return 'Conteúdo não encontrado.'
    }

    if (error.status === 400) {
      return 'Não foi possível salvar: os dados enviados são inválidos.'
    }

    if (error.status === 500) {
      return 'Erro interno no servidor ao processar a solicitação.'
    }
  }

  return 'Não foi possível concluir a operação. Tente novamente.'
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}
