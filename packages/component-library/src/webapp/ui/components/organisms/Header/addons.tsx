import { ComponentType, ReactElement } from 'react'
import { Href } from '../../../elements/link.js'

export type HeaderRightComponentRegItem = { Component: ComponentType }
export type HeaderMenuItemRegItem = {
  Text: string
  Icon: ReactElement
  Path: Href
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
