import { date_time_string, map, time_duration_string } from '@moodle/lib-types'
import { userRole } from './policies'

export type rolePolicies = {
  allow?: moo.def.policies.override.tree
  deny?: moo.def.policies.override.tree
}

export type roleConfigs = {
  revDate: date_time_string
  perm: rolePolicies
}

export type accessControlConfigs = {
  policiesConfigTree: moo.def.policies.config.tree
  roles: map<roleConfigs, userRole>
  newUserDefaultRole: userRole
  sessionExpirationTime: time_duration_string
}
