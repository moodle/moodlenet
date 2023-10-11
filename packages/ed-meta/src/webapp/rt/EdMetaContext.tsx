import type { IconTextOptionProps, TextOptionProps } from '@moodlenet/component-library'
import { getLicenseNode } from '@moodlenet/component-library'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'
import type { LearningOutcomeOption, PublishedMeta } from '../../common/types.mjs'
import { shell } from './shell.mjs'

export type EdMetaContextT = {
  publishedMetaOptions: {
    types: TextOptionProps[]
    languages: TextOptionProps[]
    licenses: IconTextOptionProps[]
    subjects: TextOptionProps[]
    levels: TextOptionProps[]
    learningOutcomes: LearningOutcomeOption[]
  }
}

export const EdMetaContext = createContext<EdMetaContextT>(null as any)

export function useEdMetaCtxValue() {
  const [publishedMeta, setPublishedMeta] = useState<PublishedMeta>({
    languages: [],
    licenses: [],
    types: [],
    levels: [],
    subjects: [],
    learningOutcomes: [],
  })

  useEffect(() => {
    shell.rpc.me('webapp/get-all-published-meta')().then(setPublishedMeta)
  }, [])

  const ctx = useMemo<EdMetaContextT>(
    () => ({
      publishedMetaOptions: {
        languages: publishedMeta.languages,
        licenses: publishedMeta.licenses.map(({ label, value }) => ({
          icon: getLicenseNode(value),
          label,
          value,
        })),
        types: publishedMeta.types,
        levels: publishedMeta.levels,
        subjects: publishedMeta.subjects,
        learningOutcomes: publishedMeta.learningOutcomes,
      },
    }),
    [publishedMeta],
  )
  return ctx
}

export const ProvideEdMetaContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <EdMetaContext.Provider value={useEdMetaCtxValue()}>{children}</EdMetaContext.Provider>
}
