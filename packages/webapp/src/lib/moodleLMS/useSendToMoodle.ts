import { AssetRef } from '@moodlenet/common/lib/content-graph/types/node'
import { useCallback, useMemo, useState } from 'react'
import { Resource } from '../../graphql/pub.graphql.link'
import { getJustAssetRefUrl } from '../../helpers/data'
import { createLocalSessionKVStorage, SESSION } from '../keyvaluestore/localSessionStorage'
import { LMSPrefs, sendToMoodle } from './LMSintegration'

const storage = createLocalSessionKVStorage(SESSION)('LMS_')
const LMS_PREFS_KEY = 'Prefs'

export const useLMS = (resource: Pick<Resource, 'kind'>, asset: AssetRef) => {
  const { updateLMSPrefs, currentLMSPrefs } = useLMSPrefs()

  const sendToLMS = useCallback(
    (LMS: LMSPrefs) => {
      // if (!( resource)) {
      //   return false
      // }
      const resource_info_stringified = JSON.stringify(resource)
      const type = resource.kind === 'Link' ? 'link' : 'file'
      const resUrl = getJustAssetRefUrl(asset)
      sendToMoodle(resUrl, resource_info_stringified, type, LMS)
      return true
    },
    [asset, resource],
  )

  return useMemo(
    () => ({
      updateLMSPrefs,
      sendToLMS,
      currentLMSPrefs,
    }),
    [updateLMSPrefs, sendToLMS, currentLMSPrefs],
  )
}

export const useLMSPrefs = () => {
  const [currentLMSPrefs, setCurrentLMSPrefs] = useState(storage.get(LMS_PREFS_KEY) as LMSPrefs | null)

  const updateLMSPrefs = useCallback(async (LMS: LMSPrefs) => {
    setCurrentLMSPrefs(LMS)
    storage.set(LMS_PREFS_KEY, LMS)
  }, [])
  return useMemo(
    () => ({
      updateLMSPrefs,
      currentLMSPrefs,
    }),
    [updateLMSPrefs, currentLMSPrefs],
  )
}
