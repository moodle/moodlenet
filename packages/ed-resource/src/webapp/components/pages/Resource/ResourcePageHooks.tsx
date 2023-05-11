import type { AddonItem, OptionItemProp } from '@moodlenet/component-library'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import type { ResourceFormProps } from '../../../../common/types.mjs'
import { maxUploadSize } from '../../../../common/validationSchema.mjs'
import { MainContext } from '../../../MainContext.js'
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

type MyProps = {
  resourceKey: string
  overrides?: Partial<ResourceFormProps>
}

export const useResourcePageProps = ({ resourceKey }: MyProps) => {
  const mainLayoutProps = useMainLayoutProps()
  const _baseProps = useResourceBaseProps({ resourceKey })
  const { registries } = useContext(MainContext)

  const generalActionsItems = useMemo<ResourceProps['generalActionsItems']>(() => {
    const items: ResourceProps['generalActionsItems'] =
      registries.resourcePageGeneralActions.registry.entries.map<AddonItem>(
        ({ item, pkgId: { name: pkgName } }, index) => ({
          ...item,
          key: `${pkgName}-${index}`,
        }),
      )
    return items
  }, [registries.resourcePageGeneralActions.registry.entries])

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
