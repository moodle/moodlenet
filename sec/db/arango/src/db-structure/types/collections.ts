import { accessControl, content, education, moderation, moodlenet, userAccount, userHome } from '@moodle/domain/model'
import { d_u } from '@moodle/lib-types'

export type appDataUserAccountCollectionData = {
  userAccount: moo.model.type.sSpaceData<userAccount.userAccountUserSpace>
  moodlenet: moo.model.type.sSpaceData<moodlenet.moodlenetUserSpace>
  accessControl: moo.model.type.sSpaceData<accessControl.accessControlUserSpace>
  moderation: moo.model.type.sSpaceData<moderation.moderationUserSpace>
  home: moo.model.type.sSpaceData<userHome.userHomeUserSpace>
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
