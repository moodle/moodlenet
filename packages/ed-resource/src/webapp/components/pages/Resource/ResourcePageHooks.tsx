import type { AddonItem, AddonItemNoKey, OptionItemProp } from '@moodlenet/component-library'
import { createHookPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { maxUploadSize } from '../../../../common/validationSchema.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { MainResourceCardSlots } from '../../organisms/MainResourceCard/MainResourceCard.js'
import type { ResourceProps } from './Resource.js'

export const collectionTextOptionProps: OptionItemProp[] = [
  { label: 'Education', value: 'Education' },
  { label: 'Biology', value: 'Biology' },
  { label: 'Algebra', value: 'Algebra' },
  { label: 'Phycology', value: 'Phycology' },
  { label: 'Phylosophy', value: 'Phylosophy' },
  { label: 'Sociology', value: 'Sociology' },
  { label: 'English Literature', value: 'English Literature' },
]

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

    return {
      mainLayoutProps,
      mainResourceCardSlots,
      resourceContributorCardProps: contributor,
      edMetaOptions: {
        languageOptions: [],
        levelOptions: [],
        licenseOptions: [],
        monthOptions: [],
        subjectOptions: [],
        typeOptions: [],
        yearOptions: [],
      },
      mainColumnItems: [],
      sideColumnItems: [],
      extraDetailsItems: [],
      generalActionsItems: addons.generalAction,
      data,
      resourceForm,
      state,
      actions,
      access,
      fileMaxSize: maxUploadSize,
      isSaving,
    }
  }, [_baseProps, mainLayoutProps, addons.topRightHeaderItems, addons.generalAction])
}
