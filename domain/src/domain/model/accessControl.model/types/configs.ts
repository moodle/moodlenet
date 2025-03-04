import { date_time_string, map, time_duration_string } from '@moodle/lib-types'
import { userRole } from './permission'

export type roleConfigs = {
  revDate: date_time_string
  permissionsTree: moo.permissions.user.tree
}

export type accessControlConfigs = {
  roles: map<roleConfigs, userRole>
  newUserDefaultRole: userRole
  sessionExpirationTime: time_duration_string
}
