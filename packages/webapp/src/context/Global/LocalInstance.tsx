import { FC, useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../helpers/data'
import { createCtx } from '../../lib/context'
import moodlenet_front_image from '../../ui/static/img/moodlenet-front-image_full.jpg'
import moodlenet_logo from '../../ui/static/img/moodlenet-logo.png'
import { useLocalInstanceQuery } from './LocalInstance/localInstance.gen'

export type LocalInstanceContextType = {
  org: {
    name: string
    summary: string
    icon: string
    image: string
    color: string
    domain: string
  }
}

export const [useLocalInstance, ProvideLocalInstance] = createCtx<LocalInstanceContextType>('LocalInstance')

export const LocalInstanceProvider: FC = ({ children }) => {
  const _localInstanceNode = useLocalInstanceQuery({ fetchPolicy: 'cache-first' }).data?.node
  const localInstanceData = _localInstanceNode?.__typename === 'Organization' ? _localInstanceNode : undefined
  const ctx = useMemo<LocalInstanceContextType | null>(() => {
    return localInstanceData
      ? {
          org: {
            color: localInstanceData.color,
            domain: localInstanceData.domain,
            icon: getMaybeAssetRefUrl(localInstanceData.icon) ?? moodlenet_logo,
            image: moodlenet_front_image,
            name: localInstanceData.name,
            summary: localInstanceData.summary,
          },
        }
      : null
  }, [localInstanceData])
  return ctx && <ProvideLocalInstance value={ctx}>{children}</ProvideLocalInstance>
}
