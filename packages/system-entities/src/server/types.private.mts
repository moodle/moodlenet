import { SystemUser } from './types.mjs'

export type SysEntitiesAsyncCtxType = CurrentUserFetchedCtx | CurrentUserNotFetchedCtx
export type CurrentUserFetchedCtx = {
  type: 'CurrentUserFetchedCtx'
  currentUser: SystemUser
}

export type CurrentUserNotFetchedCtx = {
  type: 'CurrentUserNotFetchedCtx'
  fetchCurrentUser: FetchCurrentUser
}

export type FetchCurrentUser = () => Promise<SystemUser>
