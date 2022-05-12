import { Href } from './elements/link'

export type Organization = {
  name: string
  shortName: string
  title: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  // description: string
  color: string
}

export type FollowTag = {
  type: 'subject' | 'collection' | 'type'
  name: string
  subjectHomeHref?: Href
}

export type ResourceType = 'Video' | 'Web Page' | 'Moodle Book'

export const getResourceColorType = (type?: string) => {
  switch (type) {
    case 'Video':
      return '#2A75C0'
    case 'pdf':
      return '#dd0000'
    case 'Web Page':
      return '#C233C7'
    default:
      return '#15845A'
  }
}

export type ResourceInfo = {
  type: ResourceType
  title: string
  tags: Pick<FollowTag, 'name'>[]
  image: string
}

export type AssetInfo = {
  location: string | File
  credits?: Credits | null
}

export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type CollectionInfo = {
  title: string
  image: string
}

export type User = {
  firstName: string
  LastName: string
  avatar: string
  organization: Organization
  background: string
  username: string
  location: string
  site: string
  description: string
  points: number
  kudos: number
  followers: number
  numResources: number
  antiquity: number
  following: FollowTag[]
  resources: ResourceInfo[]
  collections: CollectionInfo[]
}
