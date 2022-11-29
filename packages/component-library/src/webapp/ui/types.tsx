import { ComponentType } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonItem = {
  Item: ComponentType
  key: string | number
}
