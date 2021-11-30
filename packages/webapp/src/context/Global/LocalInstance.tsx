import { narrowNodeType } from '@moodlenet/common/dist/graphql/helpers'
import { FC, useMemo } from 'react'
// import { getMaybeAssetRefUrl } from '../../helpers/data'
// import moodlenet_front_image from '../../ui/static/img/moodlenet-front-image_full.jpg'
// import moodlenet_logo from '../../ui/static/img/moodlenet-logo.svg'
import { createCtx } from '../../lib/context'
import {
  LocalInstanceFragment,
  useLocalInstanceQuery,
} from './LocalInstance/localInstance.gen'

export type LocalInstanceContextType = {
  org: LocalInstanceFragment
}

export const [useLocalInstance, ProvideLocalInstance] =
  createCtx<LocalInstanceContextType>('LocalInstance')

export const LocalInstanceProvider: FC = ({ children }) => {
  const org = narrowNodeType(['Organization'])(
    useLocalInstanceQuery({
      fetchPolicy: 'cache-first',
    }).data?.node
  )
  const ctx = useMemo<LocalInstanceContextType | null>(() => {
    return org ? { org } : null
  }, [org])
  return (
    ctx && <ProvideLocalInstance value={ctx}>{children}</ProvideLocalInstance>
  )
}
