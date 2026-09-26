import { FormSection, ImageUrlField, ObjectListEditor, TextAreaField, TextField } from './fields'
import type { ContentFormProps, ParceirosContent } from './types'

export function ParceirosContentForm({
  value,
  onChange,
  disabled,
}: ContentFormProps<ParceirosContent>) {
  return (
    <div className="space-y-6">
      <FormSection
        title="Cabeçalho da página"
        description="Textos exibidos no topo da página de parceiros."
      >
        <TextField
          label="Título"
          value={value.heading}
          disabled={disabled}
          onChange={(heading) => onChange({ ...value, heading })}
        />
        <TextAreaField
          label="Introdução"
          value={value.subheading}
          rows={3}
          disabled={disabled}
          onChange={(subheading) => onChange({ ...value, subheading })}
        />
      </FormSection>

      <FormSection
        title="Parceiros"
        description="Nome e logo de cada parceiro. Upload de arquivo ainda não existe: a logo é editada como caminho/URL."
      >
        <ObjectListEditor
          label="Lista de parceiros"
          addLabel="Adicionar parceiro"
          items={value.items}
          disabled={disabled}
          createItem={() => ({ name: '', logo: '' })}
          itemTitle={(item, index) => item.name || `Parceiro ${index + 1}`}
          onChange={(items) => onChange({ ...value, items })}
          renderItem={(item, update) => (
            <>
              <TextField
                label="Nome"
                value={item.name}
                disabled={disabled}
                onChange={(name) => update({ ...item, name })}
              />
              <ImageUrlField
                label="Logo"
                optional
                value={item.logo ?? ''}
                disabled={disabled}
                onChange={(logo) => update({ ...item, logo })}
              />
            </>
          )}
        />
      </FormSection>
    </div>
  )
}
