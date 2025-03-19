export function getFullPoliciesConfigTree(_schemas: Pick<moo.Models.statics.Schemas, 'org' | 'moodlenet' | 'userHome'>) {
  // userHome.schemas.configs.eduDraftsOverrides
  // education.schemas.configs.collection
  const config: moo.def.policies.config.tree = {
    // admin: {
    //   _: { schemas: { orgInfo: schemas.org.orgInfo } },
    //   moodlenet: {
    //     curateInfo: { general: { edit: {}, read: {} } },
    //   },
    //   organization: {
    //     curateInfo: {
    //       general: {
    //         edit: {},
    //         read: {},
    //       },
    //     },
    //   },
    //   userBase: {
    //     managePolicies: {
    //       edit: {
    //         role: {},
    //       },
    //       searchUsers: {
    //         byText: {},
    //       },
    //     },
    //   },
    // },
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
      // _: { schemas: { baseUserData: schemas.org.baseUserData, general: schemas.org.general } },
      moodlenet: {
        viewPublicContent: {
          siteInfo: { read: {} },
          // entity: { collection: {}, contributor: {}, resource: {}, subject: {} },
          // followers: { collection: {}, subject: {}, contributor: {} },
          // fullTextSearch: { collections: {}, contributors: {}, resources: {}, subjects: {} },
        },
      },
      system: { access: { session: { myOwn: {} } } },
    },
    // authenticated: {
    //   _: {
    //     schemas: {
    //       uploadSize: schemas.userHome.uploadSize,
    //     },
    //   },
    //   edu: { curatePreferences: { categories: { edit: {}, read: {} } } },
    //   messaging: { email: { preferences: { edit: {}, read: {} }, send: { user: {} } } },
    //   moodlenet: {
    //     contribute: { publishMyContent: { collection: {}, resource: {} } },
    //     curatePreferences: { search: { edit: {}, read: {} } },
    //     curateContent: {
    //       bookmark: { collection: {}, resource: {} },
    //       follow: { collection: {}, contributor: {}, subject: {} },
    //       like: { resource: {} },
    //       report: { contributor: {} },
    //     },
    //     exchangeWithLms: { resources: { send: {} } },
    //   },
    //   myAccount: { manage: { deleteIt: { confirmDelete: {}, request: {} } }, security: { authentication: { changeMyPassword: {} } } },
    //   mySpace: {
    //     curateMyDrafts: {
    //       _: {
    //         schemas: {
    //           eduDraftSchemaOverrides: schemas.moodlenet.publishEduOverrides,
    //         },
    //       },
    //       collection: { create: {}, read: {}, edit: {}, setBackground: {}, trash: {} },
    //       resource: { create: {}, read: {}, edit: {}, setBackground: {}, trash: {} },
    //     },
    //     curateMyProfile: { info: { edit: {}, setBackground: {}, read: {}, setAvatar: {} } },
    //   },
    // },
    // moderator: { moodlenet: { manageReports: { contributors: { ignoreReports: {}, viewList: {} } } } },
  }
  return config
}

// export function deriveUnconfigured(config: moo.policies.config.tree): moo.policies.override.tree {
//   return Object.entries(config).reduce((acc, [prop, val]) => {
//     if (prop === '_') {
//       return acc
//     }
//     acc[prop] = deriveUnconfigured(val as any_)
//     return acc
//   }, {} as any_)
// }
