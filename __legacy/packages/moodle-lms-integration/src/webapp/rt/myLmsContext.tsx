import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { LmsWebUserConfig, SiteTarget } from '../../common/types.mjs'
import { shell } from './shell.mjs'

export type MyLmsContextT = {
  myLmsWebUserConfig: LmsWebUserConfig | undefined
  defaultSiteTarget: SiteTarget | undefined
  // canSend: boolean
  addSiteTarget(siteTarget: SiteTarget): Promise<void>
}

export const MyLmsContext = createContext<MyLmsContextT>(null as any)

export function MyLmsContextProvider({ children }: PropsWithChildren<unknown>) {
  const [myLmsWebUserConfig, setMyLmsWebUserConfig] = useState<LmsWebUserConfig>()
  const auth = useContext(AuthCtx)
  // const canSend = !!auth.clientSessionData?.myProfile

  const addSiteTarget: MyLmsContextT['addSiteTarget'] = useCallback(
    async siteTarget => {
      // if (!canSend) return
      await shell.rpc
        .me('webapp/add-my-lms-site-target')({ siteTarget })
        .then(setMyLmsWebUserConfig)
    },
    [
      /* canSend */
    ],
  )

  const defaultSiteTarget = useMemo<SiteTarget | undefined>(() => {
    const defaultSite = myLmsWebUserConfig?.sites[0]
    if (!defaultSite) return
    return {
      site: defaultSite.url,
      importTarget: defaultSite.importTargets[0],
    }
  }, [myLmsWebUserConfig?.sites])
  useEffect(() => {
    if (!auth.clientSessionData) return
    shell.rpc.me('webapp/get-my-config')().then(setMyLmsWebUserConfig)
  }, [auth.clientSessionData])

  const ctx = useMemo<MyLmsContextT>(
    () => ({ addSiteTarget, myLmsWebUserConfig, defaultSiteTarget /* , canSend */ }),
    [addSiteTarget, myLmsWebUserConfig, defaultSiteTarget /* , canSend */],
  )
  return <MyLmsContext.Provider value={ctx}>{children}</MyLmsContext.Provider>
}
