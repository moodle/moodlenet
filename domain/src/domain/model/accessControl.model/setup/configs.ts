import { time_duration_string_schema } from '@moodle/lib-types'
import { DEFAULT_MOODLENET_CONFIGS } from '../../moodlenet.model/setup'
import { DEFAULT_ORG_CONFIGS } from '../../org.model/setup'
import { getFullPermissionsConfigTree } from '../lib/fullPermissionTrees'
import { accessControlConfigs, rolePerm } from '../types'

const revDate = new Date().toISOString()
const permissionsConfigTree = getFullPermissionsConfigTree({
  moodlenet: DEFAULT_MOODLENET_CONFIGS,
  org: DEFAULT_ORG_CONFIGS,
})

const default_anonymous_grants: rolePerm = {
  allow: {
    any: {},
    anonymous: {},
  },
}

const default_contributor_grants: rolePerm = {
  allow: {
    any: {},
    authenticated: {},
  },
}

const default_admin_grants: rolePerm = {
  allow: {
    any: {},
    authenticated: {},
    admin: {},
    moderator: {},
  },
}

const default_viewer_grants: rolePerm = {
  allow: default_contributor_grants.allow,
  deny: {
    authenticated: {
      messaging: {},
      moodlenet: {
        contribute: {},
      },
    },
  },
}

export const DEFAULT_ACCESS_CONTROL_CONFIGS: accessControlConfigs = {
  newUserDefaultRole: 'viewer',
  permissionsConfigTree,
  roles: {
    anonymous: {
      perm: default_anonymous_grants,
      revDate,
    },
    contributor: {
      perm: default_contributor_grants,
      revDate,
    },
    admin: {
      perm: default_admin_grants,
      revDate,
    },
    viewer: {
      perm: default_viewer_grants,
      revDate,
    },
  },
  sessionExpirationTime: time_duration_string_schema.parse('P10D'),
}
