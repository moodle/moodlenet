export type Organization = {
  name: string
  shortName: string
  url: string
  logo?: string
  intro: string
  color: string
}

export type FollowTag = {
  type: 'General' | 'Specific'
  name: string
}

export type ResourceInfo = {
  type: 'Video' | 'Web Page' | 'Moodle Book'
  title: string
  tags: Pick<FollowTag, 'name'>[]
  image: string
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
