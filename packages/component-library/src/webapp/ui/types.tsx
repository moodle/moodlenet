import { ReactNode } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonPositionedItem = {
  item: ReactNode
  position: number
}

export type AddonItem = ReactNode | AddonPositionedItem
