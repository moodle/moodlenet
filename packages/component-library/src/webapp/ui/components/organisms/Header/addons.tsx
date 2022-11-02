import { ComponentType, ReactNode } from 'react'

export type HeaderRightComponentRegItem = { Component: ComponentType }
export type HeaderAvatarMenuItemRegItem = {
  Text: string
  Icon: ComponentType | ReactNode
  Path?: string
  ClassName?: string
  Position?: number
  OnClick?: () => unknown
}
