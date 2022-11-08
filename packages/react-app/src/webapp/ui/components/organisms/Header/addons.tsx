import { ComponentType, ReactElement, ReactNode } from 'react'
import { Href } from '../../elements/link.js'

export type HeaderMenuItem = {
  Text: string
  Icon: ComponentType | ReactNode
  Key: string | number
  Path?: Href
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}

export type HeaderRightComponentRegItem = { Component: ComponentType }
export type HeaderMenuItemRegItem = {
  Text: string
  Icon: ReactElement
  Path: Href
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
