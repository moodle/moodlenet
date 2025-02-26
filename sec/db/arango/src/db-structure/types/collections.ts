import { content, education, moodlenet, userAccount } from '@moodle/domain/model'
import { d_u } from '@moodle/lib-types'
import { accessControlUserSpace } from 'domain/src/domain/model/accessControl.model'

export type appDataUserCollectionData = {
  userAccount: {
    user: moo.model.type.sSpaceData<userAccount.userAccountUserSpace>
  }
  moodlenet: {
    contributor: moo.model.type.sSpaceData<moodlenet.contributorSpace>
  }
  accessControl: {
    data: moo.model.type.sSpaceData<accessControlUserSpace>
  }
}

export type appDataIscedFieldCollectionData = {
  edu: moo.model.type.sSpaceData<education.iscedFieldSpace>
}
export type appDataIscedLevelCollectionData = {
  edu: moo.model.type.sSpaceData<education.iscedLevelSpace>
}
export type appDataBloomCognitiveCollectionData = {
  edu: moo.model.type.sSpaceData<education.bloomCognitiveSpace>
}
export type appDataResourceTypeCollectionData = {
  edu: moo.model.type.sSpaceData<education.resourceTypeSpace>
}
export type appDataLanguageCollectionData = {
  edu: moo.model.type.sSpaceData<content.languageSpace>
}
export type appDataLicenseCollectionData = {
  edu: moo.model.type.sSpaceData<content.licenseSpace>
}

export type modulesModelConfigData = d_u<
  {
    [_modelName in Exclude<moo.modelName, 'configs'>]: { configs: moo.Models[_modelName][moo.configs] }
  },
  'modelName'
>
