import { ComponentType, ReactNode, ReactElement } from 'react'
import { Href } from '../../elements/link.js'

export type HeaderMenuItem = {
  Text: string
  Icon: ComponentType | ReactNode
  Path: Href
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
