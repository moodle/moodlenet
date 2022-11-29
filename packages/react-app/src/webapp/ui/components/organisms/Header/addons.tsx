import { ComponentType, ReactNode } from 'react'
import { Href } from '../../elements/link.js'

export type HeaderMenuItem = {
  Icon: ReactNode
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
  Icon: ReactNode
  Path: Href
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
