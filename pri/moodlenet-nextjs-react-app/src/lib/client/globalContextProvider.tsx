'use client'

import { webappGlobals } from '@moodle/module/moodlenet-react-app'
import { PropsWithChildren } from 'react'
import { globalCtx, GlobalCtx } from './globalContexts'

export function GlobalContextProvider({ children, webappGlobals }: PropsWithChildren<{ webappGlobals: webappGlobals }>) {
  const globalCtx: globalCtx = {
    ...webappGlobals,
    enabledCategoriesOptions: {
      bloomCognitives: webappGlobals.enabledCategories.bloomCognitives.map(eduBloomCognitiveRecord => ({
        value: eduBloomCognitiveRecord.level,
        label: eduBloomCognitiveRecord.description,
      })),
      iscedFields: webappGlobals.enabledCategories.iscedFields.map(eduIscedFieldRecord => ({
        value: eduIscedFieldRecord.code,
        label: eduIscedFieldRecord.description,
      })),
      iscedLevels: webappGlobals.enabledCategories.iscedLevels.map(eduIscedLevelRecord => ({
        value: eduIscedLevelRecord.code,
        label: eduIscedLevelRecord.description,
      })),
      resourceTypes: webappGlobals.enabledCategories.resourceTypes.map(eduResourceTypeRecord => ({
        value: eduResourceTypeRecord.id,
        label: eduResourceTypeRecord.description,
      })),
      licenses: webappGlobals.enabledCategories.licenses
        .sort((a, b) => a.restrictiveness - b.restrictiveness)
        .map(eduLicenseRecord => ({ value: eduLicenseRecord.code, label: eduLicenseRecord.name })),
      languages: webappGlobals.enabledCategories.languages.map(eduLanguageRecord => ({
        value: eduLanguageRecord.code,
        label: eduLanguageRecord.name,
      })),
    },
  }
  return <GlobalCtx.Provider value={globalCtx}>{children}</GlobalCtx.Provider>
}
