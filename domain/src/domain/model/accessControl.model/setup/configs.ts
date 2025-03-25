import { time_duration_string_schema } from '@moodle/lib-types'
import { DEFAULT_MOODLENET_SCHEMAS } from '../../moodlenet.model/setup'
import { DEFAULT_ORG_SCHEMAS } from '../../org.model/setup'
import { getFullPoliciesConfigTree } from '../lib/fullPoliciesTrees'
import { accessControlConfigs, rolePolicies } from '../types'
import { DEFAULT_USER_ACCOUNT_SCHEMAS } from '../../userHome.model/setup'

const revDate = new Date().toISOString()
const policiesConfigTree = getFullPoliciesConfigTree({
  moodlenet: DEFAULT_MOODLENET_SCHEMAS,
  org: DEFAULT_ORG_SCHEMAS,
  userHome: DEFAULT_USER_ACCOUNT_SCHEMAS,
})

const default_anonymous_grants: rolePolicies = {
  allow: {
    any: {},
    anonymous: {},
  },
}

const default_contributor_grants: rolePolicies = {
  allow: {
    any: {},
    // authenticated: {},
  },
}

const default_admin_grants: rolePolicies = {
  allow: {
    any: {},
    // authenticated: {},
    // admin: {},
    // moderator: {},
  },
}

const default_viewer_grants: rolePolicies = {
  allow: default_contributor_grants.allow,
  deny: {
    // authenticated: {
    //   messaging: {},
    //   moodlenet: {
    //     contribute: {},
    //   },
    // },
  },
}

export const DEFAULT_ACCESS_CONTROL_CONFIGS: accessControlConfigs = {
  newUserDefaultRole: 'viewer',
  policiesConfigTree,
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
