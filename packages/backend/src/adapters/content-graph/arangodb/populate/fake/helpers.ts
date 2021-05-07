import { AssetRef } from '@moodlenet/common/lib/pub-graphql/types'

export const rndImgAssetRef = (w: number, h: number): AssetRef => ({
  ext: true,
  location: `https://picsum.photos/seed/${Math.round(Math.random() * 10e8 + 10e3).toString(36)}/${w}/${h}`,
})
