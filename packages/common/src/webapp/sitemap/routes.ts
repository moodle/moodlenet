import { RouteDef } from './types'

export type Landing = RouteDef<'/', {}>
export type ActivateNewUser = RouteDef<'/activate-new-user/:token', { token: string }>
export type Login = RouteDef<'/login', {}>
export type Signup = RouteDef<'/signup', {}>
export type TermsAndConditions = RouteDef<'/terms', {}>
export type GlobalSearch = RouteDef<'/search', {}>

export type ContentNode = RouteDef<
  `/content/:nodeType/:key`,
  {
    key: string
    nodeType: string
  }
>
