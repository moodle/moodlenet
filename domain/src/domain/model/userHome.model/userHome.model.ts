/* eslint-disable @typescript-eslint/no-namespace */
import { date_time_string } from '@moodle/lib-types'
import { eduCollection, eduResource } from '../education.model'
import { userAccountUserSpace } from '../userAccount.model'
declare global {
  namespace moo {
    interface Models {
      userHome: userHome
    }
  }
}
export type draft<t> = {
  createdDate: date_time_string
  lastUpdatedDate: date_time_string
  draft: t
}
export type userHomeUserSpace = {
  myDrafts: {
    edu: {
      resources: moo.model.type.idSpaceMap<draft<eduResource>>
      collection: moo.model.type.idSpaceMap<draft<eduCollection>>
    }
  }
}

export type userHome = moo.model<userHomeModel>

export type userHomeModel = {
  [moo.configs]: never
  userHome: moo.model.type.idSpaceMap<userHomeUserSpace>
  newUser: {
    setupUserSpace: moo.model.type.endpoint<['query', { userAccountUserSpace: moo.model.type.sSpaceData<userAccountUserSpace> }, moo.model.type.sSpaceData<userHomeUserSpace>]>
  }
}

// type _ = moo.model.type.xSpaceData<userUserHomeSpace>
// type __ = moo.model.type.sSpaceData<userUserHomeSpace>

// const _:moo.model.handle = {}
// _.over(_.model.userHome.contributor['aaa']).create.async({spaceData:{points:int(12)}})
// _.over(_.model.userHome.contributor['aaa']).getData.query()
// .then((_)=>{
//   isSome(_) && _.value.profile
// })
