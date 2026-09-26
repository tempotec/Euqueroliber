/**
 * Utilitarios puros para edicao imutavel de listas no CMS.
 * Mantidos em .ts (sem JSX) para nao misturar com componentes.
 */

export function replaceAt<T>(items: T[], index: number, item: T): T[] {
  return items.map((current, position) => (position === index ? item : current))
}

export function insertAt<T>(items: T[], index: number, item: T): T[] {
  return [...items.slice(0, index), item, ...items.slice(index)]
}

export function appendAt<T>(items: T[], item: T): T[] {
  return [...items, item]
}

export function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, position) => position !== index)
}

export function moveAt<T>(items: T[], index: number, offset: number): T[] {
  const target = index + offset

  if (target < 0 || target >= items.length) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(index, 1)

  if (moved === undefined) {
    return items
  }

  next.splice(target, 0, moved)

  return next
}

export function isSameContent(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
