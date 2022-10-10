import { ComponentType } from 'react'

export type HeaderRightComponentRegItem = { Component: ComponentType }
export type HeaderAvatarMenuItemRegItem = {
  Text: string
  Icon: ComponentType
  Path?: string
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
