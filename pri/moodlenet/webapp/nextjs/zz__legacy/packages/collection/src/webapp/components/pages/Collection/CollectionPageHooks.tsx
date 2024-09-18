import { useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../MainContext'
import { useMainHook } from '../../../MainHooks'
import type { MainCollectionCardSlots } from '../../organisms/MainCollectionCard/MainCollectionCard'
import type { CollectionProps } from './Collection'

export const CollectionPagePlugins = createPlugin<
  {
    generalAction?: AddOnMap<AddonItemNoKey>
    topRightHeaderItems?: AddOnMap<AddonItemNoKey>
  },
  {
    collectionKey: string
    info: null | undefined | { name: string; isCreator: boolean }
  }
>()

export const useCollectionPageProps = ({
  collectionKey,
}: {
  collectionKey: string
}): Omit<CollectionProps, 'isEditingAtStart'> | null | undefined => {
  const { validationSchemas } = useContext(MainContext)
  // const { isAuthenticated } = useContext(AuthCtx)
  const collectionMainProps = useMainHook({ collectionKey })
  const mainLayoutProps = useMainLayoutProps()
  const info = useMemo(
    () =>
      collectionMainProps && {
        name: collectionMainProps.props.form.title,
        isCreator: collectionMainProps.props.access.isCreator,
      },
    [collectionMainProps],
  )

  const plugins = CollectionPagePlugins.usePluginHooks({
    collectionKey,
    info,
  })

  if (!collectionMainProps) return collectionMainProps
  const { actions, props } = collectionMainProps
  const resourceCardPropsList: CollectionProps['resourceCardPropsList'] = props.resourceList.map(
    ({ _key }) => {
      return {
        key: _key,
        props: proxyWith(function usePropProxy() {
          return { props: useResourceCardProps(_key) }
        }),
      }
    },
  )

  const layoutProps: Pick<
    CollectionProps,
    'wideColumnItems' | 'mainColumnItems' | 'rightColumnItems' | 'extraDetailsItems'
  > = {
    wideColumnItems: [],
    mainColumnItems: [],
    rightColumnItems: [],
    extraDetailsItems: [],
  }
  const { contributor, form: collectionForm } = props

  const mainCollectionCardSlots: MainCollectionCardSlots = {
    mainColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: plugins.getKeyedAddons('topRightHeaderItems'),
    footerRowItems: [],
    headerColumnItems: [],
    moreButtonItems: [],
  }

  const collectionProps: Omit<CollectionProps, 'isEditingAtStart'> = {
    mainLayoutProps,
    mainCollectionCardSlots,
    resourceCardPropsList,
    collectionContributorCardProps: contributor,
    ...layoutProps,
    ...props,
    collectionForm,
    actions,
    access: {
      ...props.access,
      isCreator: collectionMainProps.props.access.isCreator,
    },
    // saveState: collectionMainProps.saveState,
    validationSchemas,
  }

  return collectionProps
}
