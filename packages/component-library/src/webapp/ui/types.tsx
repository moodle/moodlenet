import { ReactElement } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonPositionedItem = {
  Item: ReactElement
  Position: number
}

export type AddonItem = ReactElement | AddonPositionedItem
