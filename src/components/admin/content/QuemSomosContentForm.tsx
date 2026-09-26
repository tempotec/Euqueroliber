import {
  FormSection,
  ImageUrlField,
  ObjectListEditor,
  StringListEditor,
  TextAreaField,
  TextField,
} from './fields'
import type { ContentFormProps, QuemSomosContent } from './types'

export function QuemSomosContentForm({
  value,
  onChange,
  disabled,
}: ContentFormProps<QuemSomosContent>) {
  const historia = value.historia
  const atuacao = value.atuacao

  const updateHistoria = (patch: Partial<QuemSomosContent['historia']>) => {
    onChange({ ...value, historia: { ...historia, ...patch } })
  }

  const updateAtuacao = (patch: Partial<QuemSomosContent['atuacao']>) => {
    onChange({ ...value, atuacao: { ...atuacao, ...patch } })
  }

  return (
    <div className="space-y-6">
      <FormSection title="Abertura" description="Título e chamada exibidos no topo da página.">
        <TextField
          label="Título"
          value={value.title}
          disabled={disabled}
          onChange={(title) => onChange({ ...value, title })}
        />
        <TextAreaField
          label="Chamada"
          value={value.lead}
          rows={2}
          disabled={disabled}
          onChange={(lead) => onChange({ ...value, lead })}
        />
        <ImageUrlField
          label="Imagem"
          value={value.image}
          disabled={disabled}
          onChange={(image) => onChange({ ...value, image })}
        />
        <TextAreaField
          label="Texto de abertura"
          value={value.opening}
          rows={4}
          disabled={disabled}
          onChange={(opening) => onChange({ ...value, opening })}
        />
      </FormSection>

      <FormSection
        title="Marcos institucionais"
        description="Cards de marcos exibidos na página. É possível adicionar, remover e reordenar."
      >
        <ObjectListEditor
          label="Marcos"
          addLabel="Adicionar marco"
          items={value.marcos}
          disabled={disabled}
          createItem={() => ({ title: '', description: '' })}
          itemTitle={(item, index) => item.title || `Marco ${index + 1}`}
          onChange={(marcos) => onChange({ ...value, marcos })}
          renderItem={(item, update) => (
            <>
              <TextField
                label="Título do marco"
                value={item.title}
                disabled={disabled}
                onChange={(title) => update({ ...item, title })}
              />
              <TextAreaField
                label="Descrição do marco"
                value={item.description}
                rows={3}
                disabled={disabled}
                onChange={(description) => update({ ...item, description })}
              />
            </>
          )}
        />
      </FormSection>

      <FormSection title="História" description="Bloco de história institucional.">
        <TextField
          label="Nome"
          value={historia.nome}
          disabled={disabled}
          onChange={(nome) => updateHistoria({ nome })}
        />
        <TextField
          label="Nome público"
          value={historia.nomePublico}
          disabled={disabled}
          onChange={(nomePublico) => updateHistoria({ nomePublico })}
        />
        <TextField
          label="Destaque"
          value={historia.destaque}
          hint="Texto curto de destaque exibido junto ao bloco de história."
          disabled={disabled}
          onChange={(destaque) => updateHistoria({ destaque })}
        />
        <StringListEditor
          label="Parágrafos"
          itemLabel="Parágrafo"
          addLabel="Adicionar parágrafo"
          items={historia.paragrafos}
          disabled={disabled}
          onChange={(paragrafos) => updateHistoria({ paragrafos })}
        />
        <ObjectListEditor
          label="Marcos da história"
          addLabel="Adicionar marco da história"
          items={historia.marcos}
          disabled={disabled}
          createItem={() => ({ ano: '', texto: '' })}
          itemTitle={(item, index) => item.ano || `Marco ${index + 1}`}
          onChange={(marcos) => updateHistoria({ marcos })}
          renderItem={(item, update) => (
            <>
              <TextField
                label="Ano"
                value={item.ano}
                disabled={disabled}
                onChange={(ano) => update({ ...item, ano })}
              />
              <TextAreaField
                label="Texto"
                value={item.texto}
                rows={2}
                disabled={disabled}
                onChange={(texto) => update({ ...item, texto })}
              />
            </>
          )}
        />
      </FormSection>

      <FormSection
        title="Atuação"
        description="Título, texto e temas da atuação institucional."
      >
        <TextField
          label="Título da atuação"
          value={atuacao.titulo}
          disabled={disabled}
          onChange={(titulo) => updateAtuacao({ titulo })}
        />
        <TextAreaField
          label="Texto da atuação"
          value={atuacao.paragrafo}
          rows={4}
          disabled={disabled}
          onChange={(paragrafo) => updateAtuacao({ paragrafo })}
        />
        <StringListEditor
          label="Temas"
          itemLabel="Tema"
          addLabel="Adicionar tema"
          items={atuacao.temas}
          disabled={disabled}
          onChange={(temas) => updateAtuacao({ temas })}
        />
      </FormSection>
    </div>
  )
}
