export type Parceiro = {
  name: string
  logo?: string
  description?: string
  url?: string
}

export const parceiros: Parceiro[] = [
  { name: 'Bizarte', logo: '/images/parceiros/bizarte.png' },
  { name: 'Hub Bossa Nova 3', logo: '/images/parceiros/bossa-nova-hub-3.jpeg' },
  { name: 'InovaiLab' },
  { name: 'Incubadora Beco Rocinha', logo: '/images/parceiros/beco-incubadora.jpeg' },
  { name: 'Incubadora da FAPERJ Rocinha' },
  { name: 'Frutear', logo: '/images/parceiros/frutear.png' },
  { name: 'OSC - Núcleo de Convivências', logo: '/images/parceiros/nucleo-convivencias.jpeg' },
]
