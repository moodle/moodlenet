import { useEffect, useMemo, useRef } from 'react'
import { useHistory } from 'react-router'
import { mainPath } from '../../../../../hooks/glob/nav'
import { getUrlParamsFromEntryPointForMoodleLMS } from '../../../../../lib/moodleLMS/LMSintegration'
import { useLMSPrefs } from '../../../../../lib/moodleLMS/useSendToMoodle'
import { CtrlHook } from '../../../../lib/ctrl'
import { LMSMoodleLandingProps } from '../LmsMoodleLanding'

export const useLmsMoodleLandingCtrl: CtrlHook<
  LMSMoodleLandingProps,
  {}
> = () => {
  const params = useRef(getUrlParamsFromEntryPointForMoodleLMS()).current
  const { updateLMSPrefs } = useLMSPrefs()
  const { replace } = useHistory()
  useEffect(() => {
    params && updateLMSPrefs(params)
  }, [params, updateLMSPrefs])

  const lMSMoodleLandingProps = useMemo<LMSMoodleLandingProps | null>(() => {
    if (!params) {
      const props: LMSMoodleLandingProps = {
        badParams: true,
      }
      return props
    }
    replace(mainPath.search)
    return null
  }, [params, replace])
  return lMSMoodleLandingProps && [lMSMoodleLandingProps]
}
