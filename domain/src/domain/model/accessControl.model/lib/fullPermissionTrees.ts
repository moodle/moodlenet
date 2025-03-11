export function getFullPermissionsConfigTree(schemas: Pick<moo.Models.statics.Schemas, 'org' | 'moodlenet'>) {
  // userAccount.schemas.configs.eduDraftsOverrides
  // education.schemas.configs.collection
  const config: moo.permissions.config.tree = {
    admin: {
      _: { schemas: { orgInfo: schemas.org.orgInfo } },
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
      _: { schemas: { baseUserData: schemas.org.baseUserData, general: schemas.org.general } },
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
          eduDraftsPublishOverrides: schemas.moodlenet.publishEduOverrides,
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
