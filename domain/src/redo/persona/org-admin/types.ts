import { profileInfo, userAccountData } from '../../model/user-home/types'

export type userSummary = {
  profile: Pick<profileInfo, 'displayName'>
  account: Pick<userAccountData, 'email' | 'roleHistory' | 'roles' | 'lastLogin' | 'creationDate' | 'deactivated'>
}
