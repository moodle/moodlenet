'use client'

import { webappGlobals } from '@moodle/module/moodlenet-react-app'
import { PropsWithChildren } from 'react'
import { globalCtx, GlobalCtx } from './globalContexts'

export function GlobalContextProvider({ children, webappGlobals }: PropsWithChildren<{ webappGlobals: webappGlobals }>) {
  const globalCtx: globalCtx = {
    ...webappGlobals,
    enabledCategoriesOptions: {
      bloomCognitives: webappGlobals.moodlenetCategories.eduBloomCognitives.map(eduBloomCognitiveRecord => ({
        value: eduBloomCognitiveRecord.level,
        label: eduBloomCognitiveRecord.description,
      })),
      iscedFields: webappGlobals.moodlenetCategories.eduIscedFields.map(eduIscedFieldRecord => ({
        value: eduIscedFieldRecord.code,
        label: eduIscedFieldRecord.description,
      })),
      iscedLevels: webappGlobals.moodlenetCategories.eduIscedLevels.map(eduIscedLevelRecord => ({
        value: eduIscedLevelRecord.code,
        label: eduIscedLevelRecord.description,
      })),
      resourceTypes: webappGlobals.moodlenetCategories.eduResourceTypes.map(eduResourceTypeRecord => ({
        value: eduResourceTypeRecord.code,
        label: eduResourceTypeRecord.description,
      })),
      licenses: webappGlobals.moodlenetCategories.contentLicenses
        .sort((a, b) => a.restrictiveness - b.restrictiveness)
        .map(eduLicenseRecord => ({ value: eduLicenseRecord.code, label: eduLicenseRecord.name })),
      languages: webappGlobals.moodlenetCategories.contentLanguages.map(eduLanguageRecord => ({
        value: eduLanguageRecord.code,
        label: eduLanguageRecord.name,
      })),
    },
  }
  return <GlobalCtx.Provider value={globalCtx}>{children}</GlobalCtx.Provider>
}
