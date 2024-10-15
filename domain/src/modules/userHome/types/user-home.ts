import { _maybe, branded, flags } from '@moodle/lib-types'
import { user_id, user_role } from '../../iam'
import { UserHomePrimaryMsgSchemaConfigs } from './primary-schemas'
import { ProfileInfo } from './profile-info'

export type user_home_id = string
export type user_excerpt = { id: user_id; roles: user_role[] }

export interface UserHomeRecord {
  id: user_home_id
  user: user_excerpt
  profileInfo: ProfileInfo
  //drafts: {}
}

declare const user_home_record_brand: unique symbol
export type user_home_record = branded<UserHomeRecord, typeof user_home_record_brand>

export type user_home_permissions = flags<'follow' | 'editRoles' | 'sendMessage' | 'report'> &
  (
    | {
        editProfile: false
      }
    | {
        editProfile: true

        validationConfigs: UserHomePrimaryMsgSchemaConfigs
      }
  )

export type user_home_access_object = {
  id: user_home_id
  profileInfo: ProfileInfo
  permissions: user_home_permissions
  flags: flags<'followed'>
  user: _maybe<user_excerpt>
}

