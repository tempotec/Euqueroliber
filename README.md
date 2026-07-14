# Eu Quero Liberdade

Site institucional da **Eu Quero Liberdade**, uma iniciativa voltada a educacao ambiental, gestao de residuos, logistica reversa, cooperativismo e inclusao socioprodutiva.

O projeto apresenta a trajetoria de Robson Borges, o Robinho Liberdade, e organiza a narrativa institucional em uma homepage responsiva, visual e orientada a conversao.

## Sobre o projeto

A pagina foi construida para comunicar, de forma clara, o proposito da Eu Quero Liberdade: transformar residuos em dignidade, trabalho e liberdade.

O site destaca:

- quem e a Eu Quero Liberdade;
- o proposito institucional da iniciativa;
- solucoes em educacao ambiental, gestao de residuos, projetos Lixo Zero, eventos sustentaveis, cooperativismo e consultoria socioambiental;
- o processo de trabalho, do diagnostico ao relatorio de impacto;
- uma linha de projetos e trajetoria apresentada de forma conservadora, sem afirmacoes nao comprovadas;
- impactos qualitativos ligados a trabalho valorizado, inclusao produtiva e transformacao territorial;
- redes e setores de atuacao;
- formulario de contato para futuros interessados.

## Status atual

Este repositorio representa um **prototipo institucional**.

Algumas informacoes publicas foram mantidas de forma propositalmente conservadora. Numeros de impacto, nomes de eventos, programas, parceiros e resultados especificos so devem ser reintroduzidos depois de validacao documental.

O formulario de contato ainda nao envia dados. Hoje ele apenas valida os campos e informa que a integracao sera definida em uma proxima etapa.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis
- Embla Carousel
- Lucide React

## Como rodar localmente

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Gere a versao de producao:

```bash
npm run build
```

Visualize o build localmente:

```bash
npm run preview
```

Execute a verificacao de lint:

```bash
npm run lint
```

## Estrutura principal

```text
src/
  components/
    layout/      Cabecalho e rodape
    sections/    Secoes principais da homepage
    ui/          Componentes reutilizaveis
  content/       Conteudo editorial, imagens e dados da pagina
  hooks/         Hooks de comportamento e interacao
public/
  images/        Imagens usadas na interface
  mock/          Imagens e arquivos auxiliares
docs/
  S2_4_CONTENT_EVIDENCE.md
```

## Conteudo e validacao

O arquivo `docs/S2_4_CONTENT_EVIDENCE.md` registra decisoes editoriais sobre afirmacoes institucionais que ainda dependem de fonte, permissao ou validacao.

Antes de publicar novas afirmacoes concretas, valide:

- numeros de impacto;
- nomes de eventos, programas, marcas e parceiros;
- autorizacao de uso das imagens;
- fontes, periodos e criterios de contagem;
- documentos, certificados, contratos, releases ou depoimentos que sustentem cada marco.

## Deploy

O projeto esta configurado no Vite com:

```ts
base: '/Euqueroliber/'
```

Essa configuracao indica que o build espera ser publicado em um subcaminho, como acontece em projetos hospedados pelo GitHub Pages. Caso o nome do repositorio ou o caminho publico mude, ajuste o campo `base` em `vite.config.ts`.

## Scripts disponiveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | inicia o ambiente local com Vite |
| `npm run build` | compila TypeScript e gera o build de producao |
| `npm run preview` | serve localmente o build gerado |
| `npm run lint` | executa o ESLint no projeto |

## Observacao

Este README substitui o texto padrao do template React + TypeScript + Vite para documentar o projeto real: seu objetivo, contexto, estrutura tecnica e cuidados editoriais antes da publicacao final.
