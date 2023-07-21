import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useCallback, useContext } from 'react'
import type { SendToMoodleProps } from '../../ui/components/SendToMoodle.js'
import { MyLmsContext } from '../myLmsContext.js'
import { useSendToLMS } from '../send-to-moodle/useSendToLms.mjs'

export function useSendToMoodle(): SendToMoodleProps {
  const auth = useContext(AuthCtx)

  const { defaultSiteTarget } = useContext(MyLmsContext)
  const { sendToLMS } = useSendToLMS()
  const sendToMoodle = useCallback<SendToMoodleProps['sendToMoodle']>(
    site => {
      sendToLMS(site ? { site } : defaultSiteTarget)
    },
    [defaultSiteTarget, sendToLMS],
  )
  const webUserKey = auth?.clientSessionData?.myProfile?.webUserKey
  const userId = webUserKey && `@${webUserKey}@${location.hostname}`
  return {
    sendToMoodle,
    site: defaultSiteTarget?.site,
    userId,
  }
}
