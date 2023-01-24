import type { expose as auth } from '@moodlenet/authentication-manager'
import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../expose.mjs'

export type ProfileFormValues = {
  displayName: string
  description: string
  organizationName?: string
  location?: string
  siteUrl?: string
  backgroundImage?: string | File | null
  avatarImage?: string | File | null
}

export type MyPkgDeps = { me: typeof me; auth: typeof auth }
export type MyPkgContext = PkgContextT<MyPkgDeps>
