import { accessControl, content, education, home, moderation, moodlenet, userAccount } from '@moodle/domain/model'
import { d_u } from '@moodle/lib-types'

export type appDataUserSpaceCollectionData = {
  userAccount: moo.model.type.sSpaceData<userAccount.userAccountUserSpace>
  moodlenet?: moo.model.type.sSpaceData<moodlenet.moodlenetUserSpace>
  accessControl?: moo.model.type.sSpaceData<accessControl.accessControlUserSpace>
  moderation?: moo.model.type.sSpaceData<moderation.moderationUserSpace>
  home?: moo.model.type.sSpaceData<home.homeUserSpace>
}

export type appDataIscedFieldCollectionData = {
  education: moo.model.type.sSpaceData<education.iscedFieldSpace>
}
export type appDataIscedLevelCollectionData = {
  education: moo.model.type.sSpaceData<education.iscedLevelSpace>
}
export type appDataBloomCognitiveCollectionData = {
  education: moo.model.type.sSpaceData<education.bloomCognitiveSpace>
}
export type appDataResourceTypeCollectionData = {
  education: moo.model.type.sSpaceData<education.resourceTypeSpace>
}
export type appDataLanguageCollectionData = {
  content: moo.model.type.sSpaceData<content.languageSpace>
}
export type appDataLicenseCollectionData = {
  content: moo.model.type.sSpaceData<content.licenseSpace>
}

export type modulesModelConfigData = d_u<
  {
    [_modelName in Exclude<moo.modelName, 'configs'>]: { configs: moo.Models[_modelName][moo.tags.configs] }
  },
  'modelName'
>
