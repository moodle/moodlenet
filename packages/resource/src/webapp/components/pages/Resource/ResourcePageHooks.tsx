import { OptionItemProp } from '@moodlenet/component-library'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { ResourceFormValues } from '../../../../common.mjs'
import { validationSchemaResource } from '../../../../common/resourceSchema.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import { ContributorCardProps } from '../../molecules/ContributorCard/ContributorCard.js'
import { useResourceCardProps } from '../../organisms/MainResourceCard/ResourceCardHook.js'
import { useResourceCollectionProps } from './formResourceCollection.js'
import { ResourceProps } from './Resource.js'
// import { MainResourceCardProps } from '../../organisms/MainResourceCard/MainResourceCard.js'

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
  const { addToCollectionsForm, sendToMoodleLmsForm } = useResourceCollectionProps({
    add: (str: string) => log(str),
    remove: (str: string) => log(str),
  })
  const { props: baseProps, contributor } = useResourceBaseProps({ resourceKey })

  const props = useMemo<ResourceProps | null>((): ResourceProps | null => {
    if (!mainResourceCardProps || !baseProps) return null

    const contributorCardProps: ContributorCardProps = contributor || {
      avatarUrl: null,
      displayName: '',
      timeSinceCreation: '',
      creatorProfileHref: { ext: false, url: '' },
    }
    return {
      mainLayoutProps,
      mainColumnItems: [],
      sideColumnItems: [],
      moreButtonItems: [],
      extraDetailsItems: [],
      validationSchema: validationSchemaResource,
      addToCollectionsForm,
      sendToMoodleLmsForm,
      contributorCardProps,
      collections: {
        opts: collectionTextOptionProps,
        selected: collectionTextOptionProps.filter(
          ({ value }) => !!addToCollectionsForm.values.collections?.includes(value),
        ),
      },
      ...baseProps,
    }
  }, [
    addToCollectionsForm,
    baseProps,
    contributor,
    mainLayoutProps,
    mainResourceCardProps,
    sendToMoodleLmsForm,
  ])

  return props
}
