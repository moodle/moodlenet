import { ComponentType, ReactNode } from 'react'
import { Href } from '../../../elements/link.js'

export type HeaderMenuItem = {
  Text: string
  Icon: ComponentType | ReactNode
  Path: Href
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
