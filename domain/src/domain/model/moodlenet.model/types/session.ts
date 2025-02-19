import { d_u } from '@moodle/lib-types'
import { userAccountRecord } from '../../user-account'
import { userProfileRecord } from '../../user-profile'
import { moodlenetContributorRecord } from './access-objects/contributor'

export type currentMoodlenetSessionData = d_u<
  {
    guest: unknown
    authenticated: {
      userProfileRecord: Omit<userProfileRecord, 'userAccount'>
      userAccountRecord: Omit<userAccountRecord, 'displayName'>
      moodlenetContributorRecord: Omit<moodlenetContributorRecord, 'userProfile'>
    }
  },
  'type'
>
