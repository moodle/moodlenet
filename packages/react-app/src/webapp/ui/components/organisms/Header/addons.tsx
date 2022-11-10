import { ComponentType, ReactElement, ReactNode } from 'react'
import { Href } from '../../elements/link.js'

export type HeaderMenuItem = {
  Icon: ComponentType | ReactNode
  text: string
  key: string | number
  path?: Href
  className?: string
  position?: number
  onClick?: () => unknown
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
