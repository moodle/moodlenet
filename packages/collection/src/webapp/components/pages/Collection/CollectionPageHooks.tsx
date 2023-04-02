import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { validationSchema } from '../../../../common/validationSchema.mjs'
import { useMainHook } from '../../../MainHooks.js'
import { MainCollectionCardSlots } from '../../organisms/MainCollectionCard/MainCollectionCard.jsx'
import { CollectionProps } from './Collection.js'

export const useCollectionPageProps = ({
  collectionKey,
}: {
  collectionKey: string
}): CollectionProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
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

    const mainCollectionCardSlots: MainCollectionCardSlots = {
      mainColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: [],
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
      access: {
        ...props.access,
        isAuthenticated,
        isCreator: _mainProps.props.access.isCreator,
      },
    }

    return propsPage
  }, [_mainProps, isAuthenticated, mainLayoutProps])

  return collectionProps
}
