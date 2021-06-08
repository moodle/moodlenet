import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'

const rndseed = () => Math.round(Math.random() * 10e8 + 10e3).toString(36)
export const rndImgAssetRef = (seed = rndseed(), [w, h] = [256, 256] as const): AssetRef => ({
  ext: true,
  location: `https://picsum.photos/seed/${seed}/${w}/${h}`,
})
