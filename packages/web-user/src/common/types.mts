//TODO: should go to `common` dir

export type ProfileFormValues = {
  displayName: string
  description: string
  organizationName?: string
  location?: string
  siteUrl?: string
  backgroundImage?: string | File | null
  avatarImage?: string | File | null
}
