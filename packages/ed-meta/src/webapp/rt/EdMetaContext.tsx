import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'
import type { PublishedMeta } from '../../common/types.mjs'
import { shell } from './shell.mjs'

export type EdMetaContextT = {
  publishedMeta: PublishedMeta
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

  const ctx = useMemo<EdMetaContextT>(() => ({ publishedMeta }), [publishedMeta])
  return ctx
}

export const ProvideEdMetaContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <EdMetaContext.Provider value={useEdMetaCtxValue()}>{children}</EdMetaContext.Provider>
}
