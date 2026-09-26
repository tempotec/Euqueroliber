import type { ContentData, ContentSectionKey } from '../../../lib/api'
import { ContatoContentForm } from './ContatoContentForm'
import { FooterContentForm } from './FooterContentForm'
import { HomeContentForm } from './HomeContentForm'
import { ParceirosContentForm } from './ParceirosContentForm'
import { ProcessoContentForm } from './ProcessoContentForm'
import { ProjetosContentForm } from './ProjetosContentForm'
import { QuemSomosContentForm } from './QuemSomosContentForm'
import { SolucoesContentForm } from './SolucoesContentForm'
import type {
  ContatoContent,
  FooterContent,
  HomeContent,
  ParceirosContent,
  ProcessoContent,
  ProjetosContent,
  QuemSomosContent,
  SolucoesContent,
} from './types'

interface ContentFormProps {
  sectionKey: ContentSectionKey
  value: ContentData
  onChange: (next: ContentData) => void
  disabled?: boolean
}

/**
 * Cada secao possui um shape proprio e mapeado no seed. O cast e seguro porque a
 * chave vem da whitelist do backend e o valor e o JSON daquela mesma seccao.
 */
export function ContentForm({ sectionKey, value, onChange, disabled }: ContentFormProps) {
  switch (sectionKey) {
    case 'home':
      return (
        <HomeContentForm
          value={value as HomeContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'quem_somos':
      return (
        <QuemSomosContentForm
          value={value as QuemSomosContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'solucoes':
      return (
        <SolucoesContentForm
          value={value as SolucoesContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'processo':
      return (
        <ProcessoContentForm
          value={value as ProcessoContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'projetos':
      return (
        <ProjetosContentForm
          value={value as ProjetosContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'parceiros':
      return (
        <ParceirosContentForm
          value={value as ParceirosContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'contato':
      return (
        <ContatoContentForm
          value={value as ContatoContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'footer':
      return (
        <FooterContentForm
          value={value as FooterContent}
          onChange={onChange}
          disabled={disabled}
        />
      )
  }
}
