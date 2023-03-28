import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { validationSchema } from '../../../../common/validationSchema.mjs'
import { useMainHook } from '../../../../MainHooks.js'
import { CollectionProps } from './Collection.js'

export const useCollectionPageProps = ({
  collectionKey,
}: {
  collectionKey: string
}): CollectionProps | null => {
  const _mainProps = useMainHook({ collectionKey })
  const mainLayoutProps = useMainLayoutProps()

  const collectionProps = useMemo<CollectionProps | null>(() => {
    if (!_mainProps || !mainLayoutProps) return null
    const { actions, props } = _mainProps
    const layoutProps = {
      wideColumnItems: [],
      mainColumnItems: [],
      sideColumnItems: [],
      moreButtonItems: [],
      extraDetailsItems: [],
    }
    const { contributor, form: collectionForm } = props
    const { data, state, access } = { ...props }

    const mainCollectionCardSlots = {
      mainColumnItems: [],
      topLeftItems: [],
      topRightItems: [],
      data,
      state,
      actions,
      access,
    }

    const propsPage: CollectionProps = {
      mainLayoutProps,
      mainCollectionCardSlots,
      collectionContributorCardProps: contributor,
      ...layoutProps,
      ...props,
      collectionForm,
      validationSchema,
      actions,
    }
    return propsPage
  }, [_mainProps, mainLayoutProps])

  return collectionProps
}
