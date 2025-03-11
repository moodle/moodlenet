/* eslint-disable @typescript-eslint/no-namespace */
import { d_u, date_time_string } from '@moodle/lib-types'
import { eduCollection, eduResource } from '../education.model'
import { userId, userProfile } from '../userAccount.model'
import { Option } from 'fp-ts/Option'
const MODEL_NAME = 'home'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: home
    }
  }
}
export type draft<t> = {
  createdDate: date_time_string
  lastUpdatedDate: date_time_string
  draft: t
}
export type homeUserSpace = {
  userId: userId
  myDrafts: {
    edu: {
      resources: draft<eduResource>[]
      collection: draft<eduCollection>[]
    }
  }
}
export type homeUserView = homeUserSpace & {
  profile: userProfile
}

export type home = moo.model<homeModel>

export type homeUserViewFilters = d_u<
  {
    userId: string
  },
  'by'
>

export type homeModel = {
  userHome: {
    create: moo.model.op<['sync', homeUserSpace, void]>
    get: moo.model.op<['query', { userId: userId }, Option<homeUserView>]>
  }
}
