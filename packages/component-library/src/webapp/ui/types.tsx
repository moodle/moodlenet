import { ReactElement } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonPositionedItem = {
  Item: ReactElement
  position: number
}

export type AddonItem = ReactElement | AddonPositionedItem
