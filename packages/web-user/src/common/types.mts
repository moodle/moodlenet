import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type me from '../main.mjs'

export type ProfileFormValues = {
  displayName: string
  description: string
  organizationName?: string
  location?: string
  siteUrl?: string
  backgroundImage?: string | File | null
  avatarImage?: string | File | null
}

export type MyPkgContext = PkgContextT<typeof me>
