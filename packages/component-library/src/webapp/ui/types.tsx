import type { ComponentType, PropsWithChildren } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
  color: string
}

export type AddonItem<P = PropsWithChildren> = {
  Item: ComponentType<P>
  key: string | number
}
export type AddonItemNoKey = Omit<AddonItem, 'key'>

export type Href = {
  ext: boolean
  url: string
}

export type FollowTag = {
  type: 'subject' | 'collection' | 'type'
  name: string
  href?: Href
}

export type PeopleFactory = {
  displayName: string
  avatarUrl: string
  backgroundUrl: string
  organization: string
  location: string
}
