export const SESSION_TEMPLATE_CONFIG: moo.session.configs = {
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
    _: { validation: {} },
    userBase: {
      managePermissions: { edit: { role: {} }, searchUsers: { byText: {} } },
    },
    moodlenet: { curateInfo: { general: { edit: {}, read: {} } } },
    organization: { curateInfo: { general: { edit: {}, read: {} } } },
  },
  any: {
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

  authenticated: {
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
