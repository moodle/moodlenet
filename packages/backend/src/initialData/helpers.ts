import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nanoid } from 'nanoid'

const _rndImgAssetRef = ([w, h]: [number, number], seed = nanoid(10)): AssetRef => ({
  ext: true,
  location: `https://picsum.photos/seed/${seed}/${w}/${h}`,
})

export const rndImgAssetRef = (t: 'img' | 'thmb', seed?: string) =>
  _rndImgAssetRef(t === 'img' ? [600, 400] : [128, 128], seed)
