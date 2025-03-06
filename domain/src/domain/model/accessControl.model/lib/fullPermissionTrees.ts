import { allModuleConfigs } from '../../configs.model'

export function getFullPermissionsConfigTree({
  org,
  moodlenet,
  // userAccount: _userAccount,
  // education: _education,
}: Pick<allModuleConfigs, 'org' | 'moodlenet'>) {
  // userAccount.configs.schema.eduDraftsOverrides
  // education.configs.schema.collection
  const config: moo.permissions.config.tree = {
    admin: {
      _: { schemas: { orgInfo: org.schema.orgInfo } },
      moodlenet: {
        curateInfo: { general: { edit: {}, read: {} } },
      },
      organization: {
        curateInfo: {
          general: {
            edit: {},
            read: {},
          },
        },
      },
      userBase: {
        managePermissions: {
          edit: {
            role: {},
          },
          searchUsers: {
            byText: {},
          },
        },
      },
    },
    anonymous: {
      access: {
        login: {
          resetMyPassword: {
            requestLink: {},
            setNew: {},
          },
          withMyEmailAndPassword: { login: {} },
        },
        signup: { withMyEmail: { confirmMyEmail: {}, submitSignupForm: {} } },
      },
    },
    any: {
      _: { schemas: { baseUserData: org.schema.baseUserData, general: org.schema.general } },
      moodlenet: {
        viewPublicContent: {
          entity: { collection: {}, contributor: {}, resource: {}, subject: {} },
          followers: { collection: {}, subject: {}, contributor: {} },
          fullTextSearch: { collections: {}, contributors: {}, resources: {}, subjects: {} },
        },
      },
      system: { access: { session: { myOwn: {} } } },
    },
    authenticated: {
      _: {
        schemas: {
          //FIXME: eduDraftsPublishOverrides should go in authenticated.moodlenet.contribute[moo.configs] scope
          eduDraftsPublishOverrides: moodlenet.schema.publishEduOverrides,
        },
      },
      edu: { curatePreferences: { categories: { edit: {}, read: {} } } },
      messaging: { email: { preferences: { edit: {}, read: {} }, send: { user: {} } } },
      moodlenet: {
        contribute: { publishMyContent: { collection: {}, resource: {} } },
        curatePreferences: { search: { edit: {}, read: {} } },
        curateContent: {
          bookmark: { collection: {}, resource: {} },
          follow: { collection: {}, contributor: {}, subject: {} },
          like: { resource: {} },
          report: { contributor: {} },
        },
        exchangeWithLms: { resources: { send: {} } },
      },
      myAccount: { manage: { deleteIt: { confirmDelete: {}, request: {} } }, security: { authentication: { changeMyPassword: {} } } },
      mySpace: {
        curateMyDrafts: {
          collection: { create: {}, read: {}, edit: {}, setBackground: {}, trash: {} },
          resource: { create: {}, read: {}, edit: {}, setBackground: {}, trash: {} },
        },
        curateMyProfile: { info: { edit: {}, setBackground: {}, read: {}, setAvatar: {} } },
      },
    },
    moderator: { moodlenet: { manageReports: { contributors: { ignoreReports: {}, viewList: {} } } } },
  }
  return config
}

// export function deriveUnconfigured(config: moo.permissions.config.tree): moo.permissions.override.tree {
//   return Object.entries(config).reduce((acc, [prop, val]) => {
//     if (prop === '_') {
//       return acc
//     }
//     acc[prop] = deriveUnconfigured(val as any_)
//     return acc
//   }, {} as any_)
// }
