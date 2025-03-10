/* eslint-disable @typescript-eslint/no-namespace */
import { int } from '@moodle/lib-types'
import { userProfile } from '../userAccount.model'
import { moodlenetConfigs } from './types'
declare global {
  namespace moo {
    interface Models {
      moodlenet: moodlenet
    }
  }
}

export type moodlenetUserSpace = {
  contributor: {
    points: int
    userProfile: moo.model.ops.atom<'view', userProfile>
  }
}

export type moodlenet = moo.model<MoodlenetModel>

export type MoodlenetModel = {
  [moo.tags.configs]: moodlenetConfigs
  contributor: moo.model.ops.collection<moodlenetUserSpace>
}

// type _ = moo.model.type.xSpaceData<contributorSpace>
// type __ = moo.model.type.sSpaceData<contributorSpace>

// const _:moo.model.handle = {}
// _.over(_.model.moodlenet.contributor['aaa']).create.async({spaceData:{points:int(12)}})
// _.over(_.model.moodlenet.contributor['aaa']).getData.query()
// .then((_)=>{
//   isSome(_) && _.value.profile
// })
