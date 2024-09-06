import { asset } from '../common'

export interface Profile {
  displayName: string
  aboutMe: string | null
  organizationName: string | null
  location: string | null
  siteUrl: string | null
  backgroundImage: asset
  avatarImage: asset
}

export interface Resource {
  title: string
  description: string
  image: asset
  content: asset
}

export interface Collection {
  title: string
  description: string
  image: asset
}
