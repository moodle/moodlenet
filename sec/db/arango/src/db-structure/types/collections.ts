import { contributorSpace } from 'domain/src/domain/model/moodlenet.model'
import { userSpace } from 'domain/src/domain/model/userAccount.model'

export type appDataUserCollectionData = {
  userAccount: {
    user: moo.model.type.sSpaceData<userSpace>
  }
  moodlenet: {
    contributor: moo.model.type.sSpaceData<contributorSpace>
  }
}
