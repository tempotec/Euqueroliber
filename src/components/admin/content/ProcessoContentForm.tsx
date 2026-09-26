import { FormSection, ImageUrlField, StringListEditor, TextField } from './fields'
import type { ContentFormProps, ProcessoContent } from './types'

export function ProcessoContentForm({
  value,
  onChange,
  disabled,
}: ContentFormProps<ProcessoContent>) {
  return (
    <FormSection
      title="Como Trabalhamos"
      description="Título, imagem e etapas do processo. Os rótulos de numeração das etapas são gerados pela interface pública."
    >
      <TextField
        label="Título"
        value={value.title}
        disabled={disabled}
        onChange={(title) => onChange({ ...value, title })}
      />
      <ImageUrlField
        label="Imagem"
        value={value.image}
        disabled={disabled}
        onChange={(image) => onChange({ ...value, image })}
      />
      <StringListEditor
        label="Etapas"
        itemLabel="Etapa"
        addLabel="Adicionar etapa"
        hint="Edite apenas o texto da etapa. A numeração é gerada pela interface pública."
        items={value.steps}
        disabled={disabled}
        onChange={(steps) => onChange({ ...value, steps })}
      />
    </FormSection>
  )
}
