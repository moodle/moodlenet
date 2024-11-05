'use client'

import { webappGlobals } from '@moodle/module/moodlenet-react-app'
import { PropsWithChildren } from 'react'
import { GlobalCtx } from '../lib/client/globalContexts'


export function GlobalContextProvider({ children, webappGlobalCtx }: PropsWithChildren<{ webappGlobalCtx: webappGlobals }>) {
  return <GlobalCtx.Provider value={webappGlobalCtx}>{children}</GlobalCtx.Provider>
}
