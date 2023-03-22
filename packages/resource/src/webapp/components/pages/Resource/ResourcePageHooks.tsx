import { OptionItemProp } from '@moodlenet/component-library'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { maxUploadSize, ResourceFormValues } from '../../../../common.mjs'
import { useResourceBaseProps } from '../../../../ResourceHooks.js'
import { ResourceContributorCardProps } from '../../molecules/ResourceContributorCard/ResourceContributorCard.js'
import { useResourceCardProps } from '../../organisms/MainResourceCard/ResourceCardHook.js'
import { validationSchema } from '../../organisms/MainResourceCard/resourceForm.js'
import { ResourceProps } from './Resource.js'

export const collectionTextOptionProps: OptionItemProp[] = [
  { label: 'Education', value: 'Education' },
  { label: 'Biology', value: 'Biology' },
  { label: 'Algebra', value: 'Algebra' },
  { label: 'Phycology', value: 'Phycology' },
  { label: 'Phylosophy', value: 'Phylosophy' },
  { label: 'Sociology', value: 'Sociology' },
  { label: 'English Literature', value: 'English Literature' },
]

const log = (str: string, val?: any) => console.log(str, val)

export const useResourcePageProps = ({
  resourceKey,
}: {
  resourceKey: string
  overrides?: Partial<ResourceFormValues>
}): ResourceProps | null => {
  const mainResourceCardProps = useResourceCardProps({ resourceKey })
  const mainLayoutProps = useMainLayoutProps()
  const _baseProps = useResourceBaseProps({ resourceKey })

  const props = useMemo<ResourceProps | null>((): ResourceProps | null => {
    if (!mainResourceCardProps || !_baseProps) return null
    const {
      actions,
      props: { data, resourceForm, state, authFlags: access },
    } = _baseProps

    const mainResourceCardSlots = {
      mainColumnItems: [],
      headerColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: [],
      moreButtonItems: undefined,
      footerRowItems: undefined,
    }

    const resourceContributorCardProps: ResourceContributorCardProps = {
      avatarUrl: null,
      displayName: '',
      timeSinceCreation: '',
      creatorProfileHref: { ext: false, url: '' },
    }
    return {
      mainLayoutProps,
      mainResourceCardSlots,
      resourceContributorCardProps,

      mainColumnItems: [],
      sideColumnItems: [],
      extraDetailsItems: [],
      data,
      resourceForm,
      validationSchema,
      state,
      actions,
      access,
      fileMaxSize: maxUploadSize,
    }
  }, [_baseProps, mainLayoutProps, mainResourceCardProps])

  return props
}
