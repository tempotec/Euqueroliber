import { publicAsset } from './homeImages'

export type Parceiro = {
  name: string
  logo?: string
  description?: string
  url?: string
}

export const parceiros: Parceiro[] = [
  { name: 'Bizarte', logo: publicAsset('/images/parceiros/bizarte.png') },
  { name: 'Hub Bossa Nova 3', logo: publicAsset('/images/parceiros/bossa-nova-hub-3.jpeg') },
  { name: 'InovaiLab' },
  { name: 'Incubadora Beco Rocinha', logo: publicAsset('/images/parceiros/beco-incubadora.jpeg') },
  { name: 'Incubadora da FAPERJ Rocinha' },
  { name: 'Frutear', logo: publicAsset('/images/parceiros/frutear.png') },
  { name: 'OSC - Núcleo de Convivências', logo: publicAsset('/images/parceiros/nucleo-convivencias.jpeg') },
]
