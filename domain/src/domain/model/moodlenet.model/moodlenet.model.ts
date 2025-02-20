/* eslint-disable @typescript-eslint/no-namespace */
import { int } from '@moodle/lib-types'
import { profileInfo } from '../userAccount.model'
import { configs } from './types'
declare global {
  namespace moo {
    interface Models {
      moodlenet: moodlenet
    }
  }
}

export type contributorSpace = {
  points: int
  profile: moo.model.type.derived<{
    info: profileInfo
    avatar: moo.content.asset.maybe
    background: moo.content.asset.maybe
  }>
}

export type moodlenet = moo.model<MoodlenetModel>

export type MoodlenetModel = {
  configs: configs
  contributor: moo.model.type.idSpaceMap<contributorSpace>
}

// type _ = moo.model.type.spaceData<contributorSpace, false>
// type __ = moo.model.type.spaceData<contributorSpace, true>

// const _:moo.model.handle = {}
// _.over(_.model.moodlenet.contributor['aaa']).create.async({spaceData:{points:int(12)}})
// _.over(_.model.moodlenet.contributor['aaa']).getData.query()
// .then((_)=>{
//   isSome(_) && _.value.profile
// })
