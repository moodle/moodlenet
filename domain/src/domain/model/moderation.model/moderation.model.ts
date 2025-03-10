/* eslint-disable @typescript-eslint/no-namespace */
import { moodlenet } from './types'
declare global {
  namespace moo {
    interface Models {
      moderation: moderation
    }
  }
}

export type moderationUserSpace = {
  reports: {
    received: {
      moodlenet: moo.model.ops.collection<{ asContributor: { items: moodlenet.contributorAbuseItem } }>
    }
  }
}

export type moderation = moo.model<moderationModel>

export type moderationModel = {
  [moo.tags.configs]: never
  userModeration: moo.model.ops.collection<moderationUserSpace>
}

// type _ = moo.model.type.xSpaceData<userModerationSpace>
// type __ = moo.model.type.sSpaceData<userModerationSpace>

// const _:moo.model.handle = {}
// _.over(_.model.moderation.contributor['aaa']).create.async({spaceData:{points:int(12)}})
// _.over(_.model.moderation.contributor['aaa']).getData.query()
// .then((_)=>{
//   isSome(_) && _.value.profile
// })
