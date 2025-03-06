import { date_time_string, map, time_duration_string } from '@moodle/lib-types'
import { userRole } from './permission'

export type rolePerm = {
  allow?: moo.permissions.override.tree
  deny?: moo.permissions.override.tree
}

export type roleConfigs = {
  revDate: date_time_string
  perm: rolePerm
}

export type accessControlConfigs = {
  permissionsConfigTree: moo.permissions.config.tree
  roles: map<roleConfigs, userRole>
  newUserDefaultRole: userRole
  sessionExpirationTime: time_duration_string
}
