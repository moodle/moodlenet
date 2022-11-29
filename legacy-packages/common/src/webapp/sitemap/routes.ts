import { RouteDef } from './types'

type EmptyParams = Record<string, never>
export type Landing = RouteDef<'/', EmptyParams>
// export type Activation = RouteDef<'/activate-new-user/:token', { token: string }>
export type Login = RouteDef<'/login/:activationEmailToken?', { activationEmailToken?: string }>
export type RecoverPassword = RouteDef<'/recover-password', EmptyParams>
export type NewPassword = RouteDef<'/new-password/:token', { token: string }>
export type Signup = RouteDef<'/signup', EmptyParams>
export type GlobalSearch = RouteDef<'/search', EmptyParams>
export type CreateNewResource = RouteDef<'/create-new-resource', EmptyParams>
export type CreateNewCollection = RouteDef<'/create-new-collection', EmptyParams>
export type BookmarksPage = RouteDef<'/bookmarks', EmptyParams>
export type SettingsPage = RouteDef<'/settings', EmptyParams>
export type LMSMoodleLanding = RouteDef<'/lms/moodle/search', EmptyParams>
export type CookiesPolicy = RouteDef<'/cookies-policy', EmptyParams>
export type UserAgreement = RouteDef<'/user-agreement', EmptyParams>

// export type FollowersPage = RouteDef<'/followers', EmptyParams>
// export type FollowersPage = RouteDef<'/followers/:typename/:slug', { typename: string; slug: string }>
export type FollowersPage = RouteDef<'/followers/:__typename/:slug', { __typename: string; slug: string }>
// export type FollowingPage = RouteDef<'/following/:typename/:slug', { typename: string; slug: string }>
export type FollowingPage = RouteDef<'/following', EmptyParams>

// node home pages
export type ContentNodeHomePage = RouteDef<`/${string}/:slug`, { slug: string }>
