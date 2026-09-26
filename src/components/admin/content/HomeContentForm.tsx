import { FieldShell, FormSection, ImageUrlField, TextAreaField, TextField } from './fields'
import { controlClass } from './styles'
import { replaceAt } from './arrayUtils'
import type { ContentFormProps, HomeContent } from './types'

export function HomeContentForm({ value, onChange, disabled }: ContentFormProps<HomeContent>) {
  const hero = value.hero
  const ctas = hero.ctas ?? []

  const updateHero = (patch: Partial<HomeContent['hero']>) => {
    onChange({ ...value, hero: { ...hero, ...patch } })
  }

  return (
    <div className="space-y-6">
      <FormSection title="Marca" description="Nome institucional exibido na página inicial.">
        <TextField
          label="Marca"
          value={value.brand}
          disabled={disabled}
          onChange={(brand) => onChange({ ...value, brand })}
        />
      </FormSection>

      <FormSection
        title="Hero"
        description="Destaque principal da Home. O Hero faz parte da seção Home — não existe uma seção separada para ele."
      >
        <TextField
          label="Título"
          value={hero.title}
          disabled={disabled}
          onChange={(title) => updateHero({ title })}
        />
        <TextAreaField
          label="Subtítulo"
          value={hero.subtitle}
          rows={3}
          disabled={disabled}
          onChange={(subtitle) => updateHero({ subtitle })}
        />
        <ImageUrlField
          label="Imagem"
          value={hero.image}
          disabled={disabled}
          onChange={(image) => updateHero({ image })}
        />

        {ctas.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">
            Nenhuma chamada para ação cadastrada no bloco Hero.
          </p>
        ) : (
          <div className="space-y-4">
            {ctas.map((cta, index) => (
              <FieldShell
                key={`hero-cta-${index}`}
                label={index === 0 ? 'CTA principal' : `CTA secundário ${index + 1}`}
                hint="Apenas o texto exibido no botão. A rota técnica não faz parte do conteúdo do CMS."
              >
                <input
                  type="text"
                  className={controlClass}
                  value={cta.label}
                  disabled={disabled}
                  onChange={(event) =>
                    updateHero({
                      ctas: replaceAt(ctas, index, { ...cta, label: event.target.value }),
                    })
                  }
                />
              </FieldShell>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  )
}
