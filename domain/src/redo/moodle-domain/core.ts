import { admin } from './persona/admin.persona'
import { anonymous } from './persona/anonymous.persona'
import { login } from './persona/anonymous.persona/access.context/login.scope/withMyEmailAndPassword.usecase/login.core'
import { confirmMyEmail } from './persona/anonymous.persona/access.context/signup.scope/withMyEmail.usecase/confirmMyEmail.core'
import { submitSignupForm } from './persona/anonymous.persona/access.context/signup.scope/withMyEmail.usecase/submitSignupForm.core'
import { any__ } from './persona/any.persona'
import { authenticated } from './persona/authenticated.persona'

export const Gate: moo.core<{
  admin: admin
  authenticated: authenticated
  anonymous: anonymous
  any: any__
}> = {
  admin: {
    userBase: {
      managePermissions: {
        personaTypes: {
          searchUsers,
        },
      },
    },
  },
  authenticated: {
    moodlenet: {
      curate: {
        bookmark: {
          collection,
          resource,
        },
        follow: {
          collection,
          contributor,
          subject,
        },
        like: {
          resource,
        },
      },
      contribute: {
        publishMyContent: {
          collection,
          resource,
        },
      },
    },
    myAccount: {
      preferences: {
        read: {
          eduCategories,
        },
        write: {
          eduCategories,
        },
      },
      manage: {
        deleteIt: {
          confirmDelete,
          request,
        },
      },
      security: {
        authentication: {
          changeMyPassword,
        },
      },
    },
    mySpace: {
      curateMyDrafts: {
        createNew: {
          collection,
          resource,
        },
        edit: {
          collection,
          resource,
        },
        read: {
          collection,
          resource,
        },
        trash: {
          collection,
          resource,
        },
      },
    },
  },
  anonymous: {
    access: {
      login: {
        resetMyPassword: {
          requestLink,
          setNew,
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
      publicContent: {
        findEntities: {
          collections,
          contributors,
          resources,
          subjects,
        },
        instanceInfo: {
          about,
        },
      },
    },
    system: {
      access: {
        session: {
          myOwn,
        },
      },
    },
  },
}
