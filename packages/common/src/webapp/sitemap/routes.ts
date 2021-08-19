import { RouteDef } from './types'

export type Landing = RouteDef<'/', {}>
export type Activation = RouteDef<'/activate-new-user/:token', { token: string }>
export type Login = RouteDef<'/login', {}>
export type Signup = RouteDef<'/signup', {}>
export type TermsAndConditions = RouteDef<'/terms', {}>
export type GlobalSearch = RouteDef<'/search', {}>
export type Profile = RouteDef<'/profile/:slug', { slug: string }>
export type CreateNewResource = RouteDef<'/create-new-resource', {}>
export type CreateNewCollection = RouteDef<'/create-new-collection', {}>
export type ResourcePage = RouteDef<'/resource/:slug', { slug: string }>
export type CollectionPage = RouteDef<'/collection/:slug', { slug: string }>
export type CategoryPage = RouteDef<'/iscedfield/:slug', { slug: string }>
