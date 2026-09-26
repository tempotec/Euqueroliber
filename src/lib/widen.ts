/**
 * Amplia tipos literais (originados de `as const`) para tipos abertos.
 *
 * Contexto: os arquivos de conteudo do site sao declarados `as const`, entao seus campos
 * viram tipos literais (`nome: "Robson Borges"` em vez de `string`). Quando o MESMO
 * componente passa a receber conteudo do CMS, os valores sao strings comuns — este helper
 * expressa essa realidade sem `any` e sem duplicar tipos.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? Widen<U>[]
        : T extends object
          ? { [key in keyof T]: Widen<T[key]> }
          : T
