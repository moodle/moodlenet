// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { KnownEntityFeature, KnownEntityTypes } from '../common/types.mjs'
import { shell } from './shell.mjs'

export const useSocialActionHook = ({
  _key,
  entityType,
  feature,
}: {
  _key: string
  entityType: KnownEntityTypes
  feature: KnownEntityFeature
}) => {
  const [isFeatured, setFeatured] = useState(false)
  useEffect(() => {
    shell.rpc.me[
      'webapp/entity-social-status/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key'
    ](undefined, {
      feature,
      _key,
      entityType,
    }).then(setFeatured)
  }, [_key, entityType, feature])

  const props = useMemo(() => {
    //  if (!pageProgs) return null
    const toggleFeatured = () => {
      return shell.rpc.me[
        'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key'
      ](undefined, {
        action: isFeatured ? 'remove' : `add`,
        feature,
        entityType,
        _key,
      }).then(() => {
        setFeatured(!isFeatured)
      })
    }
    const props = [isFeatured, toggleFeatured] as const

    return props
  }, [_key, entityType, feature, isFeatured])

  return props
}
