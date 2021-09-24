import { RouteDef } from './types'

export type Landing = RouteDef<'/', {}>
// export type Activation = RouteDef<'/activate-new-user/:token', { token: string }>
export type Login = RouteDef<'/login/:activationEmailToken?', { activationEmailToken?: string }>
export type RecoverPassword = RouteDef<'/recover-password', {}>
export type NewPassword = RouteDef<'/new-password/:token', { token: string }>
export type Signup = RouteDef<'/signup', {}>
export type TermsAndConditions = RouteDef<'/terms', {}>
export type GlobalSearch = RouteDef<'/search', {}>
export type CreateNewResource = RouteDef<'/create-new-resource', {}>
export type CreateNewCollection = RouteDef<'/create-new-collection', {}>
export type BookmarksPage = RouteDef<'/bookmarks', {}>
export type FollowingPage = RouteDef<'/following', {}>
export type LMSMoodleLanding = RouteDef<'/lms/moodle/search', {}>
export type CookiesPolicies = RouteDef<'/cookies-policies', {}>

// node home pages
export type ContentNodeHomePage = RouteDef<`/${string}/:slug`, { slug: string }>
