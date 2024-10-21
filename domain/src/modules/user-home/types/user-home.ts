import { _maybe, _nullish, branded, flags } from '@moodle/lib-types'
import { user_id, user_role } from '../../iam'
import { asset } from '../../storage'
import { profileInfo } from './profile-info'

export type user_home_id = string
export type user_excerpt = { id: user_id; roles: user_role[] }

export type userHomeRecord = {
  id: user_home_id
  user: user_excerpt
  profileInfo: profileInfo
  //drafts: {}
}

declare const user_home_record_brand: unique symbol
export type user_home_record = branded<userHomeRecord, typeof user_home_record_brand>

export type user_home_permissions = flags<'follow' | 'editRoles' | 'sendMessage' | 'report' | 'editProfile'>

export type user_home_access_object = {
  id: user_home_id
  profileInfo: profileInfo
  permissions: user_home_permissions
  flags: flags<'followed'>
  user: _maybe<user_excerpt>
  avatar: _nullish | asset
  background: _nullish | asset
}
