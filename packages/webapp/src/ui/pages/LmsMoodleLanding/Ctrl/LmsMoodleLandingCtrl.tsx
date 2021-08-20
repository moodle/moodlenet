import { useEffect, useMemo, useRef } from 'react'
import { getUrlParamsFromEntryPointForMoodleLMS } from '../../../../lib/moodleLMS/LMSintegration'
import { useLMSPrefs } from '../../../../lib/moodleLMS/useSendToMoodle'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { LMSMoodleLandingProps } from '../LmsMoodleLanding'

export const useLmsMoodleLandingCtrl: CtrlHook<LMSMoodleLandingProps, {}> = () => {
  const params = useRef(getUrlParamsFromEntryPointForMoodleLMS()).current
  const { updateLMSPrefs } = useLMSPrefs()
  const headerPageTemplateProps = ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template')
  useEffect(() => {
    params && updateLMSPrefs(params)
  }, [params, updateLMSPrefs])

  const lMSMoodleLandingProps = useMemo<LMSMoodleLandingProps>(() => {
    if (!params) {
      const props: LMSMoodleLandingProps = {
        badParams: true,
        headerPageTemplateProps,
      }
      return props
    } else {
      const props: LMSMoodleLandingProps = {
        params,
        badParams: false,
        headerPageTemplateProps,
      }
      return props
    }
  }, [headerPageTemplateProps, params])
  return [lMSMoodleLandingProps]
}
