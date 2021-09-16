import { RouteDef } from './types'

export type Landing = RouteDef<'/', {}>
// export type Activation = RouteDef<'/activate-new-user/:token', { token: string }>
export type Login = RouteDef<'/login/:activationEmailToken?', { activationEmailToken?: string }>
export type RecoverPassword = RouteDef<'/recover-password', {}>
export type NewPassword = RouteDef<'/new-password/:token', { token: string }>
export type Signup = RouteDef<'/signup', {}>
export type TermsAndConditions = RouteDef<'/terms', {}>
export type GlobalSearch = RouteDef<'/search', {}>
export type Profile = RouteDef<'/profile/:slug', { slug: string }>
export type CreateNewResource = RouteDef<'/create-new-resource', {}>
export type CreateNewCollection = RouteDef<'/create-new-collection', {}>
export type ResourcePage = RouteDef<'/resource/:slug', { slug: string }>
export type CollectionPage = RouteDef<'/collection/:slug', { slug: string }>
export type CategoryPage = RouteDef<'/iscedfield/:slug', { slug: string }>
export type BookmarksPage = RouteDef<'/bookmarks', {}>
export type Followingpage = RouteDef<'/following', {}>
export type LMSMoodleLanding = RouteDef<'/lms/moodle/search', {}>
