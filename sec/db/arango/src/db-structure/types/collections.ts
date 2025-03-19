import { accessControl, content, education, home, moderation, moodlenet, userHome } from '@moodle/domain/model'
import { authSession } from 'domain/src/domain/model/accessControl.model'

export type appDataUserHomeCollectionData = {
  userHome: userHome.userHomeRecord
  moodlenet?: moodlenet.moodlenetContributorRecord
  accessControl?: accessControl.userAccessControl
  moderation?: moderation.userModerationSpace
  home?: home.homeUserHome
}

export type appDataIscedFieldCollectionData = {
  education: education.catRecord<education.iscedField>
}
export type appDataIscedLevelCollectionData = {
  education: education.catRecord<education.iscedLevel>
}
export type appDataBloomCognitiveCollectionData = {
  education: education.catRecord<education.bloomCognitive>
}
export type appDataResourceTypeCollectionData = {
  education: education.catRecord<education.resourceType>
}
export type appDataLanguageCollectionData = {
  content: content.catRecord<content.language>
}
export type appDataLicenseCollectionData = {
  content: content.catRecord<content.license>
}

export type staticData = {
  all: moo.Models.statics.all
}

export type activeAuthSessionData = {
  authSession: authSession
}
