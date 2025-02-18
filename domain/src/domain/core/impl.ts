import { any_ } from '@moodle/lib-types'
import { admin } from '../persona/admin.persona'
import { anonymous } from '../persona/anonymous.persona'
import { login } from '../persona/anonymous.persona/access.context/login.scope/withMyEmailAndPassword.usecase/login.core'
import { confirmMyEmail } from '../persona/anonymous.persona/access.context/signup.scope/withMyEmail.usecase/confirmMyEmail.core'
import { submitSignupForm } from '../persona/anonymous.persona/access.context/signup.scope/withMyEmail.usecase/submitSignupForm.core'
import { any__ } from '../persona/any.persona'
import { authenticated } from '../persona/authenticated.persona'

const UNIMPLEMENTED = undefined as any_

export const core: moo.core<{
  admin: admin
  authenticated: authenticated
  anonymous: anonymous
  any: any__
}> = {
  admin: {
    userBase: {
      managePermissions: {
        edit: {
          role: UNIMPLEMENTED,
        },
        searchUsers: {
          byText: UNIMPLEMENTED,
        },
      },
    },
    moodlenet: {
      curateInfo: {
        general: {
          edit: UNIMPLEMENTED,
          read: UNIMPLEMENTED,
        },
      },
    },
    organization: {
      curateInfo: {
        general: {
          edit: UNIMPLEMENTED,
          read: UNIMPLEMENTED,
        },
      },
    },
  },
  authenticated: {
    edu: {
      curatePreferences: {
        categories: {
          read: UNIMPLEMENTED,
          write: UNIMPLEMENTED,
        },
      },
    },
    messaging: {
      email: {
        preferences: {
          read: UNIMPLEMENTED,
          write: UNIMPLEMENTED,
        },
        send: {
          user: UNIMPLEMENTED,
        },
      },
    },
    moodlenet: {
      curateContent: {
        bookmark: {
          collection: UNIMPLEMENTED,
          resource: UNIMPLEMENTED,
        },
        follow: {
          collection: UNIMPLEMENTED,
          contributor: UNIMPLEMENTED,
          subject: UNIMPLEMENTED,
        },
        like: {
          resource: UNIMPLEMENTED,
        },
        report: {
          contributor: UNIMPLEMENTED,
        },
      },
      contribute: {
        publishMyContent: {
          collection: UNIMPLEMENTED,
          resource: UNIMPLEMENTED,
        },
      },
      curatePreferences: {
        search: {
          read: UNIMPLEMENTED,
          write: UNIMPLEMENTED,
        },
      },
      exchangeWithLms: {
        resources: {
          send: UNIMPLEMENTED,
        },
      },
    },
    myAccount: {
      manage: {
        deleteIt: {
          confirmDelete: UNIMPLEMENTED,
          request: UNIMPLEMENTED,
        },
      },
      security: {
        authentication: {
          changeMyPassword: UNIMPLEMENTED,
        },
      },
    },
    mySpace: {
      curateMyDrafts: {
        collection: {
          read: UNIMPLEMENTED,
          create: UNIMPLEMENTED,
          edit: UNIMPLEMENTED,
          trash: UNIMPLEMENTED,
          setBackgroundImage: UNIMPLEMENTED,
        },
        resource: {
          read: UNIMPLEMENTED,
          create: UNIMPLEMENTED,
          edit: UNIMPLEMENTED,
          trash: UNIMPLEMENTED,
          setBackgroundImage: UNIMPLEMENTED,
        },
      },
      curateMyProfile: {
        info: {
          edit: UNIMPLEMENTED,
          read: UNIMPLEMENTED,
          setAvatar: UNIMPLEMENTED,
          setBackground: UNIMPLEMENTED,
        },
      },
    },
  },
  anonymous: {
    access: {
      login: {
        resetMyPassword: {
          requestLink: UNIMPLEMENTED,
          setNew: UNIMPLEMENTED,
        },
        withMyEmailAndPassword: {
          login,
        },
      },
      signup: {
        withMyEmail: {
          confirmMyEmail,
          submitSignupForm,
        },
      },
    },
  },
  any: {
    moodlenet: {
      viewPublicContent: {
        fullTextSearch: {
          collections: UNIMPLEMENTED,
          contributors: UNIMPLEMENTED,
          resources: UNIMPLEMENTED,
          subjects: UNIMPLEMENTED,
        },
        entity: {
          collection: UNIMPLEMENTED,
          contributor: UNIMPLEMENTED,
          resource: UNIMPLEMENTED,
          subject: UNIMPLEMENTED,
        },
        followers: {
          collection: UNIMPLEMENTED,
          contributor: UNIMPLEMENTED,
          subject: UNIMPLEMENTED,
        },
      },
    },
    system: {
      access: {
        session: {
          myOwn: UNIMPLEMENTED,
        },
      },
    },
  },
}
