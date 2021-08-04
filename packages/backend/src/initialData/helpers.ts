const _rndImgAssetRef = ([w, h]: [number, number], seed = `${Math.random()}`) => ({
  ext: true,
  location: `https://picsum.photos/seed/${seed}/${w}/${h}`,
})

export const rndImgAssetRef = (t: 'img' | 'thmb', seed?: string) =>
  _rndImgAssetRef(t === 'img' ? [600, 400] : [128, 128], seed)
