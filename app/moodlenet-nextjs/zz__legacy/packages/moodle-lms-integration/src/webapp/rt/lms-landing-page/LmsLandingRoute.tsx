import { useNeedsWebUserLogin } from '@moodlenet/web-user/webapp'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ImportTarget, SiteTarget } from '../../../common/types.mjs'
import { MyLmsContext } from '../myLmsContext.js'

export function LmsLandingRouteComponent() {
  const myLmsCtx = useContext(MyLmsContext)
  const nav = useNavigate()
  const auth = useNeedsWebUserLogin()
  const siteTarget = getSiteTargetByMoodleLMSEntryPointUrlParams()
  useEffect(() => {
    if (!(auth && siteTarget)) {
      return
    }
    myLmsCtx.addSiteTarget(siteTarget).then(() => nav('/search', { replace: true }))
  }, [myLmsCtx, nav, siteTarget, auth])
  if (!auth) {
    return null
  }
  if (!siteTarget) {
    return (
      <div>
        <h2>Bad Params</h2>
      </div>
    )
  }
  return null
}

export const getSiteTargetByMoodleLMSEntryPointUrlParams = (): SiteTarget | null => {
  const q = new URLSearchParams(window.location.search)
  const site = q.get('site')
  if (!site) {
    return null
  }
  const course = q.get('course') || void 0
  const section = q.get('section') || void 0
  const importTarget: ImportTarget | undefined = course && section ? { course, section } : undefined
  return {
    site,
    importTarget,
  }
}
