/*
instnziato dentro pagina di risorsa, quindi sono sulla risorsa con la sua resource key
prop hook 
reouerceKey arogmento funzione da passare 

al click del bottone modale con list di collezioni del utente , 
e vedere se gia presente,  
  'webapp/my-collections/:containingResourceKey'(
ritrona  Promise<{ collectionKey: string; collectionName: string; hasResource: boolean }[]> per 
costruire selectOptions, lista di tutte le collezioni, con booleano se presente la resourseKey 

SelectOptionsMulti<OptionItemProp>
lista di opzioni e le opzioni selezionate 

se faccio un add remove , cambio booleano direttamente alla vaeiabile di stato ,
funzioni di cambio stato manualmente

*/

import type { OptionItemProp } from '@moodlenet/component-library'
import type { SelectOptionsMulti } from '@moodlenet/react-app/ui'
import { useContext, useMemo, useState } from 'react'
import { MainContext } from '../../../MainContext.js'
import type { AddToCollectionButtonProps } from './AddToCollectionButtons.js'

type Action = 'remove' | 'add'
const empityOptions: SelectOptionsMulti<OptionItemProp> = { opts: [], selected: [] }

export const useAddToCollectionButtons = (resourcenKey: string): AddToCollectionButtonProps => {
  const [collections, setCollections] = useState<SelectOptionsMulti<OptionItemProp>>(empityOptions)
  const { rpcCaller } = useContext(MainContext)

  const actions = useMemo(() => {
    const getResource = () =>
      rpcCaller.collectionsResorce(resourcenKey).then(res => {
        const acc = empityOptions
        res.map(el => {
          const item = {
            value: el.collectionKey,
            label: el.collectionName,
          }
          acc.opts.push(item)
          el.hasResource && acc.selected.push(item)
        })

        setCollections(acc)
      })

    const actions = (action: Action) => (collectionId: string) => {
      rpcCaller.actionResorce(collectionId, action, resourcenKey).then(getResource)
    }

    return {
      add: actions('add'),
      remove: actions('remove'),
    }
  }, [resourcenKey, rpcCaller])

  const hook = {
    add: actions.add,
    remove: actions.remove,
    collections,
  }
  return hook
}
