import { accessControl, content, education, home, moderation, moodlenet, userAccount } from '@moodle/domain/model'
import { d_u } from '@moodle/lib-types'

export type appDataUserSpaceCollectionData = {
  userAccount: moo.model.ops.sSpaceData<userAccount.userAccountRecord>
  moodlenet?: moo.model.ops.sSpaceData<moodlenet.moodlenetContributorSpace>
  accessControl?: moo.model.ops.sSpaceData<accessControl.accessControlUserSpace>
  moderation?: moo.model.ops.sSpaceData<moderation.moderationUserSpace>
  home?: moo.model.ops.sSpaceData<home.homeUserSpace>
}

export type appDataIscedFieldCollectionData = {
  education: moo.model.ops.sSpaceData<education.iscedFieldSpace>
}
export type appDataIscedLevelCollectionData = {
  education: moo.model.ops.sSpaceData<education.iscedLevelSpace>
}
export type appDataBloomCognitiveCollectionData = {
  education: moo.model.ops.sSpaceData<education.bloomCognitiveSpace>
}
export type appDataResourceTypeCollectionData = {
  education: moo.model.ops.sSpaceData<education.resourceTypeSpace>
}
export type appDataLanguageCollectionData = {
  content: moo.model.ops.sSpaceData<content.languageSpace>
}
export type appDataLicenseCollectionData = {
  content: moo.model.ops.sSpaceData<content.licenseSpace>
}

export type modulesModelConfigData = d_u<
  {
    [_modelName in Exclude<moo.modelName, 'configs'>]: { configs: moo.Models[_modelName][moo.tags.configs] }
  },
  'modelName'
>
