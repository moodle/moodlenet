import { getLicenseNode, type AddonItem, type AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { EdMetaContext } from '@moodlenet/ed-meta/webapp'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import moment from 'moment'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../MainContext.js'
import type { ResourceCommonProps } from '../../../ResourceHooks.js'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { MainResourceCardSlots } from '../../organisms/MainResourceCard/MainResourceCard.js'
import type { ResourceProps } from './Resource.js'

export type ResourcePageGeneralActionsAddonItem = Pick<AddonItem, 'Item'>

export const ResourcePagePlugins = createPlugin<
  {
    generalAction?: AddOnMap<AddonItemNoKey>
    topRightHeaderItems?: AddOnMap<AddonItemNoKey>
  },
  {
    resourceKey: string
    info: null | undefined | { name: string; isCreator: boolean }
    resourceCommonProps: null | undefined | ResourceCommonProps
  }
>()

export type ResourcePageHookArg = {
  resourceKey: string
}
export type ProxiedResourceProps = Omit<ResourceProps, 'isEditingAtStart'>
export const useResourcePageProps = ({ resourceKey }: ResourcePageHookArg) => {
  const { configs, validationSchemas } = useContext(MainContext)
  const mainLayoutProps = useMainLayoutProps()
  const resourceCommonProps = useResourceBaseProps({ resourceKey })

  const info = useMemo(
    () =>
      resourceCommonProps && {
        name: resourceCommonProps.props.resourceForm.title,
        isCreator: resourceCommonProps.props.access.isCreator,
      },
    [resourceCommonProps],
  )

  const plugins = ResourcePagePlugins.usePluginHooks({
    resourceKey,
    info,
    resourceCommonProps,
  })

  const { publishedMeta } = useContext(EdMetaContext)

  if (!resourceCommonProps) return resourceCommonProps
  const { actions, props, saveState } = resourceCommonProps
  const { data, resourceForm, state, access, contributor } = props

  const mainResourceCardSlots: MainResourceCardSlots = {
    mainColumnItems: [],
    headerColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: plugins.getKeyedAddons('topRightHeaderItems'),
    moreButtonItems: [],
    footerRowItems: [],
    uploadOptionsItems: [],
  }

  const layoutProps: Pick<
    ResourceProps,
    'wideColumnItems' | 'mainColumnItems' | 'rightColumnItems' | 'extraDetailsItems'
  > = {
    wideColumnItems: [],
    mainColumnItems: [],
    rightColumnItems: [],
    extraDetailsItems: [],
  }
  const resourceProps: ProxiedResourceProps = {
    saveState,
    mainLayoutProps,
    mainResourceCardSlots,
    resourceContributorCardProps: contributor,
    edMetaOptions: {
      languageOptions: publishedMeta.languages,
      levelOptions: publishedMeta.levels,
      licenseOptions: publishedMeta.licenses.map(({ label, value }) => ({
        icon: getLicenseNode(value),
        label,
        value,
      })),
      subjectOptions: publishedMeta.subjects,
      typeOptions: publishedMeta.types,
      monthOptions: moment
        .months()
        .map((month, index) => ({ label: month, value: `${index + 1}` })),
      yearOptions: Array.from({ length: 100 }, (_, i) => {
        const year = new Date().getFullYear() - i
        return `${year}` //{ label: `${year}`, value: `${year}` }
      }),
    },
    ...layoutProps,

    generalActionsItems: plugins.getKeyedAddons('generalAction'),
    data,
    resourceForm,
    state,
    actions,
    access,
    fileMaxSize: configs.validations.contentMaxUploadSize,
    validationSchemas,
  }
  return resourceProps
}
