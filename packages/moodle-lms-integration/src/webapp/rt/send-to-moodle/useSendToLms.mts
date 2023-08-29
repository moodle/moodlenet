import type { ProxiedResourceProps } from '@moodlenet/ed-resource/webapp'
import { CurrentResourceContext } from '@moodlenet/ed-resource/webapp'
import { useCallback, useContext, useMemo } from 'react'
import type { SiteTarget } from '../../../common/types.mjs'
import { MyLmsContext } from '../myLmsContext.js'

export type LmsResourceInfo = {
  canonicalUrl: string
  icon: string
  licence: string
  name: string
  summary: string
}
type LmsResourceData = { resourceInfo: LmsResourceInfo; type: 'link' | 'file'; resourceurl: string }
function getLmsResourceData(
  resourceProps: ProxiedResourceProps | null | undefined,
): LmsResourceData | undefined {
  if (
    !(
      resourceProps?.state.isPublished &&
      resourceProps.data.contentUrl &&
      resourceProps.data.contentType
    )
  ) {
    return
  }
  const resourceInfo: LmsResourceInfo = {
    canonicalUrl: resourceProps.data.contentUrl,
    icon: resourceProps.data.image?.location ?? '',
    licence: (resourceProps.resourceForm.license ?? 'N/A').toUpperCase(),
    name: resourceProps.resourceForm.title,
    summary: resourceProps.resourceForm.description,
  }
  return {
    resourceInfo,
    resourceurl: resourceProps.data.contentUrl,
    type: resourceProps.data.contentType,
  }
}
export const useSendToLMS = () => {
  const { defaultSiteTarget, addSiteTarget /* , canSend  */ } = useContext(MyLmsContext)
  const { resourceProps } = useContext(CurrentResourceContext)
  const lmsResourceData = getLmsResourceData(resourceProps)
  const sendToLMS = useCallback(
    (_siteTarget?: SiteTarget) => {
      const siteTarget = _siteTarget ?? defaultSiteTarget
      if (!(lmsResourceData && siteTarget)) {
        return false
      }
      if (_siteTarget && _siteTarget !== defaultSiteTarget) {
        addSiteTarget(_siteTarget)
      }

      sendToMoodleInNewWindow({ siteTarget, lmsResourceData })
      return true
    },
    [addSiteTarget, defaultSiteTarget, lmsResourceData],
  )

  return useMemo(
    () => ({
      canSend: !!lmsResourceData,
      sendToLMS,
    }),
    [lmsResourceData, sendToLMS],
  )
}

export const sendToMoodleInNewWindow = ({
  lmsResourceData,
  siteTarget: { site, importTarget },
}: {
  lmsResourceData: LmsResourceData
  siteTarget: SiteTarget
}) => {
  const form = document.createElement('form')
  form.target = '_blank'
  form.method = 'POST'
  form.action = `${site}/admin/tool/moodlenet/import.php`
  form.style.display = 'none'
  const params = {
    resourceurl: lmsResourceData.resourceurl,
    course: importTarget?.course,
    section: importTarget?.section,
    type: lmsResourceData.type,
    resource_info: JSON.stringify(lmsResourceData.resourceInfo),
  }
  // console.table({site,...params})
  Object.entries(params).forEach(([name, val]) => {
    const hiddenField = document.createElement('input')
    hiddenField.type = 'hidden'
    hiddenField.name = name
    hiddenField.value = val || ''
    form.appendChild(hiddenField)
  })

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
