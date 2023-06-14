import { getLicenseNode, type AddonItem, type AddonItemNoKey } from '@moodlenet/component-library'
import { EdMetaContext } from '@moodlenet/ed-meta/webapp'
import { createHookPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import moment from 'moment'
import { useContext, useMemo } from 'react'
import { maxUploadSize } from '../../../../common/validationSchema.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { MainResourceCardSlots } from '../../organisms/MainResourceCard/MainResourceCard.js'
import type { ResourceProps } from './Resource.js'

export type ResourcePageGeneralActionsAddonItem = Pick<AddonItem, 'Item'>

export const ResourcePagePlugins = createHookPlugin<
  {
    generalAction: AddonItemNoKey
    topRightHeaderItems: AddonItemNoKey
  },
  {
    resourceKey: string
  }
>({ generalAction: null, topRightHeaderItems: null })

type ResourcePageHookArg = {
  resourceKey: string
}

export const useResourcePageProps = ({ resourceKey }: ResourcePageHookArg) => {
  const mainLayoutProps = useMainLayoutProps()
  const _baseProps = useResourceBaseProps({ resourceKey })

  const [addons] = ResourcePagePlugins.useHookPlugin({ resourceKey })

  const { publishedMeta } = useContext(EdMetaContext)

  return useMemo<ResourceProps | null>((): ResourceProps | null => {
    if (!_baseProps) return null
    const { actions, props, isSaving } = _baseProps
    const { data, resourceForm, state, access, contributor } = props

    const mainResourceCardSlots: MainResourceCardSlots = {
      mainColumnItems: [],
      headerColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: addons.topRightHeaderItems,
      moreButtonItems: [],
      footerRowItems: [],
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
    return {
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

      generalActionsItems: addons.generalAction,
      data,
      resourceForm,
      state,
      actions,
      access,
      fileMaxSize: maxUploadSize,
      isSaving,
    }
  }, [
    _baseProps,
    addons.topRightHeaderItems,
    addons.generalAction,
    mainLayoutProps,
    publishedMeta.languages,
    publishedMeta.levels,
    publishedMeta.licenses,
    publishedMeta.subjects,
    publishedMeta.types,
  ])
}
