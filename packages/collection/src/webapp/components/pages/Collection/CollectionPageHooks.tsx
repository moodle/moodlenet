import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import { validationSchema } from '../../../../common/validationSchema.mjs'
import { useMainHook } from '../../../MainHooks.js'
import { MainCollectionCardSlots } from '../../organisms/MainCollectionCard/MainCollectionCard.jsx'
import { CollectionProps } from './Collection.js'

export const useCollectionPageProps = ({
  collectionKey,
}: {
  collectionKey: string
}): CollectionProps | null => {
  // const { isAuthenticated } = useContext(AuthCtx)
  const _mainProps = useMainHook({ collectionKey })
  const mainLayoutProps = useMainLayoutProps()

  const collectionProps = useMemo(() => {
    if (!_mainProps || !mainLayoutProps) return null
    const { actions, props, isSaving } = _mainProps
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
      resourceCardPropsList: [], //@ETTO this need to be filled
      collectionContributorCardProps: contributor,
      ...layoutProps,
      ...props,
      collectionForm,
      validationSchema,
      actions,
      access: {
        ...props.access,
        // isAuthenticated,
        isCreator: _mainProps.props.access.isCreator,
      },
      isSaving,
    }

    return propsPage
  }, [_mainProps, mainLayoutProps])

  return collectionProps
}
