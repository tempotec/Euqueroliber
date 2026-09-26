import { FormSection, StringListEditor, TechnicalNote, TextAreaField, TextField } from './fields'
import type { ContatoContent, ContentFormProps } from './types'

export function ContatoContentForm({
  value,
  onChange,
  disabled,
}: ContentFormProps<ContatoContent>) {
  const fieldLabels = Object.entries(value.fields ?? {})

  return (
    <div className="space-y-6">
      <FormSection
        title="Textos do contato"
        description="Conteúdo institucional e mensagens exibidas na área de contato."
      >
        <TextField
          label="Título"
          value={value.title}
          disabled={disabled}
          onChange={(title) => onChange({ ...value, title })}
        />
        <TextAreaField
          label="Introdução"
          value={value.intro}
          rows={3}
          disabled={disabled}
          onChange={(intro) => onChange({ ...value, intro })}
        />
        <TextField
          label="Texto do botão"
          value={value.ctaLabel}
          disabled={disabled}
          onChange={(ctaLabel) => onChange({ ...value, ctaLabel })}
        />
        <TextField
          label="Texto do botão durante o envio"
          value={value.sendingLabel}
          disabled={disabled}
          onChange={(sendingLabel) => onChange({ ...value, sendingLabel })}
        />
        <TextAreaField
          label="Mensagem de sucesso"
          value={value.successMessage}
          rows={2}
          disabled={disabled}
          onChange={(successMessage) => onChange({ ...value, successMessage })}
        />
      </FormSection>

      <FormSection
        title="Assuntos"
        description="Opções exibidas no seletor de assunto do formulário."
      >
        <StringListEditor
          label="Assuntos"
          itemLabel="Assunto"
          addLabel="Adicionar assunto"
          items={value.subjects}
          disabled={disabled}
          onChange={(subjects) => onChange({ ...value, subjects })}
        />
      </FormSection>

      <TechnicalNote>
        <span className="font-semibold text-[var(--ink)]">
          Campos funcionais do formulário
        </span>{' '}
        — gerenciados pela aplicação e não editáveis no painel:{' '}
        {fieldLabels.length === 0
          ? 'nenhum rótulo cadastrado.'
          : fieldLabels.map(([fieldKey, label]) => `${label} (${fieldKey})`).join(', ')}
        .
      </TechnicalNote>
    </div>
  )
}
