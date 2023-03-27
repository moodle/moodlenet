import { OptionItemProp } from '@moodlenet/component-library'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { maxUploadSize, ResourceFormValues } from '../../../../common.mjs'
import { validationSchema } from '../../../../common/validationSchema.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
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

export const useResourcePageProps = ({
  resourceKey,
}: {
  resourceKey: string
  overrides?: Partial<ResourceFormValues>
}): ResourceProps | null => {
  const mainLayoutProps = useMainLayoutProps()
  const _baseProps = useResourceBaseProps({ resourceKey })

  const props = useMemo<ResourceProps | null>((): ResourceProps | null => {
    if (!_baseProps) return null
    const {
      actions,
      props: { data, resourceForm, state, authFlags: access, contributor },
    } = _baseProps

    const mainResourceCardSlots = {
      mainColumnItems: [],
      headerColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: [],
      moreButtonItems: undefined,
      footerRowItems: undefined,
    }

    return {
      mainLayoutProps,
      mainResourceCardSlots,
      resourceContributorCardProps: contributor,

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
  }, [_baseProps, mainLayoutProps])

  return props
}
