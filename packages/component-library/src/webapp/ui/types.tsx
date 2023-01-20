import { ComponentType } from 'react'

export type Organization = {
  logo: string
  smallLogo: string
  url: string
}

export type AddonItem = {
  Item: ComponentType
  key: string | number
}

export type Href = {
  ext: boolean
  url: string
}

export type FollowTag = {
  type: 'subject' | 'collection' | 'type'
  name: string
  subjectHomeHref?: Href
}
