import { ComponentType, ReactElement } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonItem = {
  Item: ReactElement
  position?: number
}
