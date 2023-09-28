import type { ComponentType, PropsWithChildren } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
  color: string
}

export type AddonItem<P = PropsWithChildren<unknown>> = {
  Item: ComponentType<P>
  key: string | number
  position?: number
}
export type AddonItemNoKey = Omit<AddonItem, 'key'>

export type Href = {
  ext: boolean
  url: string
}

export type FollowTag = {
  type: 'subject' | 'collection' | 'type'
  name: string
  href: Href | null
}

export type PeopleFactory = {
  displayName: string
  avatarUrl: string
  backgroundUrl: string
  organization: string
  location: string
}
