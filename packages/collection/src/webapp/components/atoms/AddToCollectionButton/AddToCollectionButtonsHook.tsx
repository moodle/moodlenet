import type { OptionItemProp } from '@moodlenet/component-library'
import type { SelectOptionsMulti } from '@moodlenet/react-app/ui'
import { useContext, useEffect, useMemo, useState } from 'react'
import type { CollectionsResorce } from '../../../../common/types.mjs'
import { MainContext } from '../../../MainContext.js'
import type { AddToCollectionButtonProps } from './AddToCollectionButtons.js'

type Action = 'remove' | 'add'
const empityOptions: SelectOptionsMulti<OptionItemProp> = { opts: [], selected: [] }
// const isCollectionId = (collectionId: string) => (el: CollectionsResorce) =>
//   el.collectionKey === collectionId

const collectionToProps = (res: CollectionsResorce[]): SelectOptionsMulti<OptionItemProp> =>
  res.reduce((acc, el) => {
    const item = {
      value: el.collectionKey,
      label: el.collectionName,
    }
    return {
      opts: [...acc.opts, item],
      selected: el.hasResource ? [...acc.selected, item] : acc.selected,
    }
  }, empityOptions)

export const useAddToCollectionButtons = (resourceKey: string): AddToCollectionButtonProps => {
  const [rpcData, setRpcData] = useState<CollectionsResorce[]>([])
  const { rpcCaller } = useContext(MainContext)

  useEffect(() => {
    rpcCaller.collectionsResorce(resourceKey).then(res => setRpcData(res))
  }, [resourceKey, rpcCaller])

  const collections = useMemo<AddToCollectionButtonProps['collections']>(() => {
    return collectionToProps(rpcData)
  }, [rpcData])

  const addToCollectionButtonProps = useMemo(() => {
    const setterCollections = (action: Action, collectionKey: string) => () => {
      // const current = rpcData && rpcData.find(isCollectionId(collectionId))
      // if (!rpcData || !current) return

      // const dataExlucdeCurrent = rpcData.filter(el => !isCollectionId(collectionId)(el))
      // const hasResource = action === 'add' || action === 'remove' || current.hasResource
      // setRpcData([...dataExlucdeCurrent, { ...current, hasResource }])
      const updated = rpcData.map(item => {
        const hasResource =
          item.collectionKey === collectionKey ? action === 'add' : item.hasResource
        return {
          ...item,
          hasResource,
        }
      })

      setRpcData(updated)
    }

    const actions = (action: Action) => (collectionKey: string) => {
      rpcCaller
        .actionResorce(collectionKey, action, resourceKey)
        .then(setterCollections(action, collectionKey))
    }

    const props: AddToCollectionButtonProps = {
      add: actions('add'),
      remove: actions('remove'),
      collections,
    }

    return props
  }, [collections, resourceKey, rpcCaller, rpcData])

  return addToCollectionButtonProps
}
