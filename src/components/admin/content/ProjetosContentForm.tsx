import { FormSection, ImageUrlField, ObjectListEditor, TextAreaField, TextField } from './fields'
import type { ContentFormProps, ProjetosContent } from './types'

export function ProjetosContentForm({
  value,
  onChange,
  disabled,
}: ContentFormProps<ProjetosContent>) {
  const cta = value.cta
  const timeline = value.timeline ?? {}

  return (
    <div className="space-y-6">
      <FormSection
        title="Cabeçalho da página"
        description="Textos exibidos no topo da página de projetos."
      >
        <TextField
          label="Título da página"
          value={value.heading}
          disabled={disabled}
          onChange={(heading) => onChange({ ...value, heading })}
        />
        <TextAreaField
          label="Introdução da página"
          value={value.subheading}
          rows={3}
          disabled={disabled}
          onChange={(subheading) => onChange({ ...value, subheading })}
        />
      </FormSection>

      <FormSection
        title="Seção de projetos"
        description="Título e texto introdutório exibidos acima da lista de projetos. São textos diferentes do cabeçalho da página."
      >
        <TextField
          label="Título da seção"
          value={timeline.heading ?? ''}
          hint="Deixe em branco para manter o título atual do site."
          disabled={disabled}
          onChange={(heading) => onChange({ ...value, timeline: { ...timeline, heading } })}
        />
        <TextAreaField
          label="Texto introdutório da seção"
          value={timeline.subheading ?? ''}
          rows={3}
          hint="Deixe em branco para manter o texto atual do site."
          disabled={disabled}
          onChange={(subheading) =>
            onChange({ ...value, timeline: { ...timeline, subheading } })
          }
        />
      </FormSection>

      <FormSection title="Projetos" description="Cards de projetos exibidos na página.">
        <ObjectListEditor
          label="Projetos"
          addLabel="Adicionar projeto"
          items={value.items}
          disabled={disabled}
          createItem={() => ({ title: '', description: '', image: { src: '' } })}
          itemTitle={(item, index) => item.title || `Projeto ${index + 1}`}
          onChange={(items) => onChange({ ...value, items })}
          renderItem={(item, update) => (
            <>
              <TextField
                label="Título do projeto"
                value={item.title}
                disabled={disabled}
                onChange={(title) => update({ ...item, title })}
              />
              <TextAreaField
                label="Descrição"
                value={item.description}
                rows={3}
                disabled={disabled}
                onChange={(description) => update({ ...item, description })}
              />
              <ImageUrlField
                label="Imagem do projeto"
                value={item.image?.src ?? ''}
                disabled={disabled}
                onChange={(src) => update({ ...item, image: { ...item.image, src } })}
              />
            </>
          )}
        />
      </FormSection>

      <FormSection title="Chamada final" description="Bloco de CTA exibido ao final da página.">
        <TextField
          label="Título da chamada"
          value={cta.title}
          disabled={disabled}
          onChange={(title) => onChange({ ...value, cta: { ...cta, title } })}
        />
        <TextField
          label="Texto do botão"
          value={cta.label}
          hint="Apenas o texto do botão. A rota de destino não é editável."
          disabled={disabled}
          onChange={(label) => onChange({ ...value, cta: { ...cta, label } })}
        />
      </FormSection>
    </div>
  )
}
