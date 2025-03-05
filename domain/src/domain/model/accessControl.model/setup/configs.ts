import { time_duration_string_schema } from '@moodle/lib-types'
import { DEFAULT_MOODLENET_CONFIGS } from '../../moodlenet.model/setup'
import { DEFAULT_ORG_CONFIGS } from '../../org.model/setup'
import { getFullUserSession } from '../lib/fullUserSession'
import { accessControlConfigs } from '../types'

const revDate = new Date().toISOString()
const { fullUserSession } = getFullUserSession({
  moodlenet: DEFAULT_MOODLENET_CONFIGS,
  org: DEFAULT_ORG_CONFIGS,
})

const anonymous_default_permissionsTree: moo.permissions.user.tree = {
  anonymous: fullUserSession.anonymous,
  any: fullUserSession.any,
}
const contributor_default_permissionsTree: moo.permissions.user.tree = {
  any: fullUserSession.any,
  authenticated: fullUserSession.authenticated,
}
const admin_default_permissionsTree: moo.permissions.user.tree = {
  ...contributor_default_permissionsTree,
  admin: fullUserSession.admin,
  moderator: fullUserSession.moderator,
}
const viewer_default_permissionsTree: moo.permissions.user.tree = {
  ...contributor_default_permissionsTree,
  authenticated: {
    ...contributor_default_permissionsTree.authenticated,
    _: fullUserSession.authenticated._,
    messaging: {
      email: {
        ...contributor_default_permissionsTree.authenticated?.messaging?.email,
        send: undefined,
      },
    },
  },
}
export const DEFAULT_ACCESS_CONTROL_CONFIGS: accessControlConfigs = {
  newUserDefaultRole: 'viewer',
  roles: {
    anonymous: {
      permissionsTree: anonymous_default_permissionsTree,
      revDate,
    },
    contributor: {
      permissionsTree: contributor_default_permissionsTree,
      revDate,
    },
    admin: {
      permissionsTree: admin_default_permissionsTree,
      revDate,
    },
    viewer: {
      permissionsTree: viewer_default_permissionsTree,
      revDate,
    },
  },
  sessionExpirationTime: time_duration_string_schema.parse('P10D'),
}
