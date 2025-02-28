/* eslint-disable @typescript-eslint/no-namespace */
import { date_time_string } from '@moodle/lib-types'
import { eduCollection, eduResource } from '../education.model'
declare global {
  namespace moo {
    interface Models {
      home: home
    }
  }
}
export type draft<t> = {
  createdDate: date_time_string
  lastUpdatedDate: date_time_string
  draft: t
}
export type homeUserSpace = {
  myDrafts: {
    edu: {
      resources: moo.model.type.idSpaceMap<draft<eduResource>>
      collection: moo.model.type.idSpaceMap<draft<eduCollection>>
    }
  }
}

export type home = moo.model<homeModel>

export type homeModel = {
  [moo.tags.configs]: never
  userHome: moo.model.type.idSpaceMap<homeUserSpace>
}
