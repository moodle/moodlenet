export type Url = string
export type Category = string
export type Type = string
export type Level = string
export type Language = string
export type Format = string
export type License = string
export type Collection = string
export type ProfileFormValues = {
  displayName: string
  description: string
  username: string
  organizationName: string
  location: string
  siteUrl: string
  backgroundImage: Url | File | null
  backgroundUrl: string | null
  avatarImage: Url | File | null
  avatarUrl: string |null
}
