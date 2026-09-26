import { FormSection, TechnicalNote, TextAreaField } from './fields'
import type { ContentFormProps, FooterContent } from './types'

export function FooterContentForm({ value, onChange, disabled }: ContentFormProps<FooterContent>) {
  return (
    <div className="space-y-6">
      <FormSection
        title="Rodapé"
        description="Mensagem institucional exibida no rodapé do site."
      >
        <TextAreaField
          label="Mensagem"
          value={value.message}
          rows={3}
          disabled={disabled}
          onChange={(message) => onChange({ ...value, message })}
        />
      </FormSection>

      <TechnicalNote>
        O copyright e o ano do rodapé são gerados automaticamente pelo site e não fazem parte do
        conteúdo editável. Nenhum campo de ano, copyright ou direitos é exibido aqui.
      </TechnicalNote>
    </div>
  )
}
