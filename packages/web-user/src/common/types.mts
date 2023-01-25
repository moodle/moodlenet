import type { expose as auth } from '@moodlenet/authentication-manager'
import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../server/expose.mjs'

export type MyPkgDeps = { me: typeof me; auth: typeof auth }
export type MyPkgContext = PkgContextT<MyPkgDeps>

export type ProfileFormValues = {
  title: string
  description: string
  organizationName?: string
  location?: string
  siteUrl?: string
  backgroundImage?: string | File | null
  avatarImage?: string | File | null
}

export type UserTypeApiProps = {
  userId: string
  title: string
  email: string
  isAdmin: boolean
}
