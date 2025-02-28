/* eslint-disable @typescript-eslint/no-namespace */
import { userAccountUserSpace } from '../userAccount.model'
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
      moodlenet: moo.model.type.idSpaceMap<{ asContributor: { items: moodlenet.contributorAbuseItem } }>
    }
  }
}

export type moderation = moo.model<moderationModel>

export type moderationModel = {
  [moo.tags.configs]: never
  userModeration: moo.model.type.idSpaceMap<moderationUserSpace>
  newUser: {
    setupUserSpace: moo.model.type.endpoint<['query', { userAccountUserSpace: moo.model.type.sSpaceData<userAccountUserSpace> }, moo.model.type.sSpaceData<moderationUserSpace>]>
  }
}

// type _ = moo.model.type.xSpaceData<userModerationSpace>
// type __ = moo.model.type.sSpaceData<userModerationSpace>

// const _:moo.model.handle = {}
// _.over(_.model.moderation.contributor['aaa']).create.async({spaceData:{points:int(12)}})
// _.over(_.model.moderation.contributor['aaa']).getData.query()
// .then((_)=>{
//   isSome(_) && _.value.profile
// })
