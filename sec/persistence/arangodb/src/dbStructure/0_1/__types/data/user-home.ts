export interface UserHome {
  userId: string
  drafts: {
    // resources: ResourceDraft[]
    // collections: CollectionDraft[]
  }
  // links: LinkedEntity[]
  preferences: Preferences
}
export interface Preferences {
  subjects: string[]
  licenses: string[]
  levels: string[]
  languages: string[]
}
export interface Publishable {
  published: {
    id: string
  }
}
