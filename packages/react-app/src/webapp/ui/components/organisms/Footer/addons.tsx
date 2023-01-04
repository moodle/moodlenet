import { ComponentType, ReactNode } from 'react'
import { Href } from '../../elements/link.js'

export type FooterMenuItem = {
  Icon: ReactNode
  text: string
  key: string | number
  path?: Href
  className?: string
  position?: number
  onClick?: () => unknown
}

export type FooterComponentRegItem = { Component: ComponentType }
export type FooterMenuItemRegItem = {
  Text: string
  Icon: ReactNode
  Path: Href
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
