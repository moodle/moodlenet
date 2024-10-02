import { branded } from '@moodle/lib-types'
import { user_id } from '../../iam'
import { ProfileInfo } from './profile-info'

export type user_home_id = string
export interface UserHomeRecord {
  id: user_home_id
  userId: user_id
  profileInfo: ProfileInfo
  //drafts: {}
}

declare const user_home_record_brand: unique symbol
export type user_home_record = branded<UserHomeRecord, typeof user_home_record_brand>
