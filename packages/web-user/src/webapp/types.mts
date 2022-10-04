import { ReactAppMainComponentProps } from '@moodlenet/react-app/web-lib.mjs'
import type myConn from '../main.mjs'
export type WebPkgDeps = [typeof myConn]

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
  organizationName?: string
  location?: string
  siteUrl?: string
  backgroundImage?: Url | File | null
  avatarImage?: Url | File | null
}

export type MainContextT = ReactAppMainComponentProps<WebPkgDeps> & {}
