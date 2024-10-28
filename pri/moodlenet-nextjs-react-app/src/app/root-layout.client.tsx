'use client'

import { webappGlobalCtx } from '@moodle/module/moodlenet-react-app'
import { PropsWithChildren } from 'react'
import { GlobalCtx } from '../lib/client/globalContexts'


export function GlobalContextProvider({
  children,
  webappGlobalCtx,
}: PropsWithChildren<{ webappGlobalCtx: webappGlobalCtx }>) {
  return <GlobalCtx.Provider value={webappGlobalCtx}>{children}</GlobalCtx.Provider>
}
