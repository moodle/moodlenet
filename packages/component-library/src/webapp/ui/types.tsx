import type { ComponentType } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonItem<P = any> = {
  Item: ComponentType<P>
  key: string | number
}

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
  username: string
  organization: string
  location: string
}
