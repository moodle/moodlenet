import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'

const _rndseed = () => Number(`${Math.random()}`.substr(2)).toString(36)
const _rndImgAssetRef = ([w, h]: [number, number], seed = _rndseed()): AssetRef => ({
  ext: true,
  location: `https://picsum.photos/seed/${seed}/${w}/${h}`,
})

export const rndImgAssetRef = (t: 'img' | 'thmb', seed?: string) =>
  _rndImgAssetRef(t === 'img' ? [600, 400] : [128, 128], seed)
