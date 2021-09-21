import { AssetRef } from '@moodlenet/common/lib/content-graph/types/node'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useMemo, useState } from 'react'
import { License, Resource } from '../../graphql/pub.graphql.link'
import { getMaybeAssetRefUrl } from '../../helpers/data'
import { createLocalSessionKVStorage, LOCAL } from '../keyvaluestore/localSessionStorage'
import { LMSPrefs, sendToMoodle } from './LMSintegration'

const storage = createLocalSessionKVStorage(LOCAL)('LMS_')
const LMS_PREFS_KEY = 'Prefs'

export const useLMS = (
  obj: Maybe<{
    resource: Pick<Resource, 'id' | 'image' | 'name' | 'description'>
    license: Pick<License, 'code'>
    asset: AssetRef
  }>,
) => {
  const { updateLMSPrefs, currentLMSPrefs } = useLMSPrefs()
  const sendToLMS = useCallback(
    (_site?: Maybe<string>) => {
      const site = _site ?? currentLMSPrefs?.site
      if (!(obj && site)) {
        return false
      }
      if (_site && _site !== currentLMSPrefs?.site) {
        updateLMSPrefs({ ...currentLMSPrefs, site: _site })
      }
      const { asset, license, resource } = obj
      // const resUrl = getJustAssetRefUrl(asset)
      // FIXME: hardcoded url gen for local env ..
      const resUrl = asset.ext
        ? asset.location
        : `${window.location.protocol}//${window.location.host}/assets/${asset.location}`

      const resource_info = {
        canonicalUrl: `${window.location.protocol}//${window.location.host}${nodeGqlId2UrlPath(resource.id)}`,
        icon: getMaybeAssetRefUrl(resource.image) ?? '',
        licence: license.code.toUpperCase(),
        name: resource.name,
        summary: resource.description,
        url: resUrl,
      }
      const resource_info_stringified = JSON.stringify(resource_info)

      const type = asset.ext ? 'link' : 'file'
      // console.log({ resUrl, resource_info, type, LMS })
      sendToMoodle(resUrl, resource_info_stringified, type, { ...currentLMSPrefs, site })
      return true
    },
    [currentLMSPrefs, obj, updateLMSPrefs],
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
