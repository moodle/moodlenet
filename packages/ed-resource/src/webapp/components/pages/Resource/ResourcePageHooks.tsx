import type { AddonItem, OptionItemProp } from '@moodlenet/component-library'
import { useMainLayoutProps, usePkgAddOns } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { ResourceFormProps } from '../../../../common/types.mjs'
import { maxUploadSize } from '../../../../common/validationSchema.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { MainResourceCardSlots } from '../../organisms/MainResourceCard/MainResourceCard.js'
import type { ResourceProps } from './Resource.js'

export type ResourcePageGeneralActionsAddonItem = Pick<AddonItem, 'Item'>

export const collectionTextOptionProps: OptionItemProp[] = [
  { label: 'Education', value: 'Education' },
  { label: 'Biology', value: 'Biology' },
  { label: 'Algebra', value: 'Algebra' },
  { label: 'Phycology', value: 'Phycology' },
  { label: 'Phylosophy', value: 'Phylosophy' },
  { label: 'Sociology', value: 'Sociology' },
  { label: 'English Literature', value: 'English Literature' },
]

type ResourcePageHookArg = {
  resourceKey: string
  overrides?: Partial<ResourceFormProps>
}

export const useResourcePageProps = ({ resourceKey }: ResourcePageHookArg) => {
  const mainLayoutProps = useMainLayoutProps()
  const _baseProps = useResourceBaseProps({ resourceKey })
  const [resourcePageGeneralActions /* , registerResourcePageGeneralActions */] =
    usePkgAddOns<ResourcePageGeneralActionsAddonItem>('ResourcePageGeneralActions')

  const generalActionsItems = useMemo<ResourceProps['generalActionsItems']>(() => {
    const items: ResourceProps['generalActionsItems'] = resourcePageGeneralActions.map<AddonItem>(
      ({ addOn: { Item }, key }) => ({
        Item,
        key,
      }),
    )
    return items
  }, [resourcePageGeneralActions])

  return useMemo<ResourceProps | null>((): ResourceProps | null => {
    if (!_baseProps) return null
    const { actions, props, isSaving } = _baseProps
    const { data, resourceForm, state, access, contributor } = props

    const mainResourceCardSlots: MainResourceCardSlots = {
      mainColumnItems: [],
      headerColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: [],
      moreButtonItems: [],
      footerRowItems: [],
    }

    return {
      mainLayoutProps,
      mainResourceCardSlots,
      resourceContributorCardProps: contributor,

      mainColumnItems: [],
      sideColumnItems: [],
      extraDetailsItems: [],
      generalActionsItems,
      data,
      resourceForm,
      state,
      actions,
      access,
      fileMaxSize: maxUploadSize,
      isSaving,
    }
  }, [_baseProps, mainLayoutProps, generalActionsItems])
}
