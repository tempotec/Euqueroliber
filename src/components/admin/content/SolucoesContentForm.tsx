import {
  ImageUrlField,
  ObjectListEditor,
  StringListEditor,
  TechnicalNote,
  TextAreaField,
  TextField,
} from './fields'
import type { ContentFormProps, SolucaoItem, SolucoesContent } from './types'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

interface SolucaoItemEditorProps {
  item: SolucaoItem
  index: number
  onUpdate: (next: SolucaoItem) => void
  disabled?: boolean
}

function SolucaoItemEditor({ item, index, onUpdate, disabled }: SolucaoItemEditorProps) {
  const hasCta = item.cta !== undefined
  const hasActingNote = item.actingNote !== undefined

  return (
    <details
      className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5"
      open={index === 0}
    >
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[var(--blue-deep)]">
            {item.title || `Solução ${index + 1}`}
          </span>
          <span className="rounded-full bg-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Editar
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {item.subtitle || 'Sem subtítulo cadastrado.'}
        </p>
      </summary>

      <div className="mt-5 space-y-4">
        <TextField
          label="Título"
          value={item.title}
          disabled={disabled}
          onChange={(title) => onUpdate({ ...item, title })}
        />

        {item.subtitle !== undefined ? (
          <TextField
            label="Subtítulo"
            value={item.subtitle}
            disabled={disabled}
            onChange={(subtitle) => onUpdate({ ...item, subtitle })}
          />
        ) : null}

        {item.description !== undefined ? (
          <TextAreaField
            label="Descrição"
            value={item.description}
            rows={3}
            disabled={disabled}
            onChange={(description) => onUpdate({ ...item, description })}
          />
        ) : null}

        {item.icon !== undefined ? (
          <TechnicalNote>
            Ícone (referência técnica preservada): <strong>{item.icon}</strong>. Este valor aponta
            para um ícone da interface e não é editável no painel.
          </TechnicalNote>
        ) : null}

        {item.image ? (
          <ImageUrlField
            label="Imagem principal"
            value={item.image.src ?? ''}
            disabled={disabled}
            onChange={(src) => onUpdate({ ...item, image: { ...item.image, src } })}
          />
        ) : null}

        {item.intro ? (
          <StringListEditor
            label="Introdução"
            itemLabel="Parágrafo de introdução"
            addLabel="Adicionar parágrafo"
            items={item.intro}
            disabled={disabled}
            onChange={(intro) => onUpdate({ ...item, intro })}
          />
        ) : null}

        {item.actingIntro !== undefined ? (
          <TextAreaField
            label="Introdução da atuação"
            value={item.actingIntro}
            rows={3}
            disabled={disabled}
            onChange={(actingIntro) => onUpdate({ ...item, actingIntro })}
          />
        ) : null}

        {hasActingNote && typeof item.actingNote === 'string' ? (
          <TextAreaField
            label="Nota da atuação"
            value={item.actingNote}
            rows={3}
            disabled={disabled}
            onChange={(actingNote) => onUpdate({ ...item, actingNote })}
          />
        ) : null}

        {hasActingNote && isStringArray(item.actingNote) ? (
          <StringListEditor
            label="Nota da atuação"
            itemLabel="Item da nota"
            addLabel="Adicionar item"
            items={item.actingNote}
            disabled={disabled}
            onChange={(actingNote) => onUpdate({ ...item, actingNote })}
          />
        ) : null}

        {item.actions ? (
          <StringListEditor
            label="Ações"
            itemLabel="Ação"
            addLabel="Adicionar ação"
            items={item.actions}
            disabled={disabled}
            onChange={(actions) => onUpdate({ ...item, actions })}
          />
        ) : null}

        {item.socialHeading !== undefined ? (
          <TextField
            label="Título do bloco social"
            value={item.socialHeading}
            disabled={disabled}
            onChange={(socialHeading) => onUpdate({ ...item, socialHeading })}
          />
        ) : null}

        {item.impactoSocial ? (
          <StringListEditor
            label="Impacto social"
            itemLabel="Item de impacto social"
            addLabel="Adicionar item"
            items={item.impactoSocial}
            disabled={disabled}
            onChange={(impactoSocial) => onUpdate({ ...item, impactoSocial })}
          />
        ) : null}

        {item.problemaSolucao ? (
          <StringListEditor
            label="Problema e solução"
            itemLabel="Item"
            addLabel="Adicionar item"
            items={item.problemaSolucao}
            disabled={disabled}
            onChange={(problemaSolucao) => onUpdate({ ...item, problemaSolucao })}
          />
        ) : null}

        {item.sections ? (
          <ObjectListEditor
            label="Seções internas"
            addLabel="Adicionar seção interna"
            items={item.sections}
            disabled={disabled}
            createItem={() => ({ heading: '', intro: [], items: [] })}
            itemTitle={(section, sectionIndex) =>
              section.heading || `Seção ${sectionIndex + 1}`
            }
            onChange={(sections) => onUpdate({ ...item, sections })}
            renderItem={(section, updateSection) => (
              <>
                <TextField
                  label="Título da seção"
                  value={section.heading}
                  disabled={disabled}
                  onChange={(heading) => updateSection({ ...section, heading })}
                />
                {section.intro ? (
                  <StringListEditor
                    label="Introdução da seção"
                    itemLabel="Parágrafo"
                    addLabel="Adicionar parágrafo"
                    items={section.intro}
                    disabled={disabled}
                    onChange={(intro) => updateSection({ ...section, intro })}
                  />
                ) : null}
                {section.items ? (
                  <StringListEditor
                    label="Itens da seção"
                    itemLabel="Item"
                    addLabel="Adicionar item"
                    items={section.items}
                    disabled={disabled}
                    onChange={(items) => updateSection({ ...section, items })}
                  />
                ) : null}
              </>
            )}
          />
        ) : null}

        {item.detailImage ? (
          <ImageUrlField
            label="Imagem de detalhe"
            value={item.detailImage.src ?? ''}
            disabled={disabled}
            onChange={(src) => onUpdate({ ...item, detailImage: { ...item.detailImage, src } })}
          />
        ) : null}

        {hasCta && typeof item.cta === 'string' ? (
          <TextAreaField
            label="CTA"
            value={item.cta}
            rows={2}
            disabled={disabled}
            onChange={(cta) => onUpdate({ ...item, cta })}
          />
        ) : null}

        {hasCta && isStringArray(item.cta) ? (
          <StringListEditor
            label="CTA"
            itemLabel="Linha do CTA"
            addLabel="Adicionar linha"
            items={item.cta}
            disabled={disabled}
            onChange={(cta) => onUpdate({ ...item, cta })}
          />
        ) : null}
      </div>
    </details>
  )
}

export function SolucoesContentForm({
  value,
  onChange,
  disabled,
}: ContentFormProps<SolucoesContent>) {
  const items = value.items ?? []

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-warm)] p-4 sm:p-5">
        <div className="space-y-4">
          <TextField
            label="Título da seção Soluções"
            value={value.heading}
            disabled={disabled}
            onChange={(heading) => onChange({ ...value, heading })}
          />
          <TextAreaField
            label="Subtítulo da seção Soluções"
            value={value.subheading}
            rows={2}
            disabled={disabled}
            onChange={(subheading) => onChange({ ...value, subheading })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--ink)]">Soluções</p>
        <p className="text-xs text-[var(--muted)]">
          Cada solução possui campos próprios. Somente os campos que existem naquela solução são
          exibidos abaixo.
        </p>
        {items.map((item, index) => (
          <SolucaoItemEditor
            key={`solucao-${index}`}
            item={item}
            index={index}
            disabled={disabled}
            onUpdate={(next) =>
              onChange({
                ...value,
                items: items.map((current, position) =>
                  position === index ? next : current,
                ),
              })
            }
          />
        ))}
      </div>
    </div>
  )
}
