export type webImageSize = 'small' | 'medium' | 'large'
export type webImageResizesConfigs = {
  small: number
  medium: number
  large: number
}

export type uploadMaxSizeConfigs = {
  max: number
  webImage: number
}

export interface Configs {
  uploadMaxSize: uploadMaxSizeConfigs
  webImageResizes: webImageResizesConfigs
  tempFileMaxRetentionSeconds: number
}
