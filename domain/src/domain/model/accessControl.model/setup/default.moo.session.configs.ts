import { int } from '@moodle/lib-types'
export const defaultSessionConfig: moo.session.configs = {
  moderator: {
    moodlenet: {
      manageReports: {
        contributors: {
          ignoreReports: {},
          viewList: {},
        },
      },
    },
  },
  admin: {
    _: { validation: undefined },
    userBase: {
      managePermissions: { edit: { role: {} }, searchUsers: { byText: {} } },
    },
    moodlenet: { curateInfo: { general: { edit: {}, read: {} } } },
    organization: { curateInfo: { general: { edit: {}, read: {} } } },
  },
  authenticated: {
    _: {
      validation: {
        entity: {
          description: { max: int(1000), min: int(10) },
          title: { max: int(100), min: int(5) },
        },
      },
    },
    edu: {
      curatePreferences: {
        categories: {
          read: {},
          edit: {},
        },
      },
    },
    messaging: {
      email: { preferences: { edit: {}, read: {} }, send: { user: {} } },
    },
    moodlenet: {
      contribute: {
        publishMyContent: { collection: {}, resource: {} },
      },
      curateContent: {
        bookmark: { collection: {}, resource: {} },
        like: { resource: {} },
        follow: { collection: {}, contributor: {}, subject: {} },
        report: { contributor: {} },
      },
      curatePreferences: { search: { read: {}, edit: {} } },
      exchangeWithLms: { resources: { send: {} } },
    },
    myAccount: {
      manage: {
        deleteIt: {
          confirmDelete: {},
          request: {},
        },
      },
      security: {
        authentication: {
          changeMyPassword: {},
        },
      },
    },
    mySpace: {
      curateMyProfile: {
        info: { edit: {}, read: {}, setAvatar: {}, setBackground: {} },
      },
      curateMyDrafts: {
        collection: {
          create: {},
          edit: {},
          read: {},
          setBackgroundImage: {},
          trash: {},
        },
        resource: {
          create: {},
          edit: {},
          read: {},
          setBackgroundImage: {},
          trash: {},
        },
      },
    },
  },
  any: {
    _: {
      validation: {
        baseUserData: {
          displayName: { max: int(100), min: int(2) },
          password: { max: int(100), min: int(8) },
        },
        general: {
          email: { max: int(100) },
          id: { max: int(100), min: int(5) },
          textSearch: { max: int(100), min: int(2) },
        },
      },
    },
    system: {
      access: {
        session: { myOwn: {} },
      },
    },
    moodlenet: {
      viewPublicContent: {
        entity: {
          collection: {},
          resource: {},
          contributor: {},
          subject: {},
        },
        followers: {
          collection: {},
          contributor: {},
          subject: {},
        },
        fullTextSearch: {
          collections: {},
          resources: {},
          contributors: {},
          subjects: {},
        },
      },
    },
  },
  anonymous: {
    access: {
      signup: {
        withMyEmail: {
          confirmMyEmail: {},
          submitSignupForm: {},
        },
      },
      login: {
        withMyEmailAndPassword: {
          login: {},
        },
        resetMyPassword: {
          requestLink: {},
          setNew: {},
        },
      },
    },
  },
}
