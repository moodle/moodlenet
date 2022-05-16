const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY

export type UnsplashApisEnv = {
  accessKey?: string
}

const unsplashApisEnv: UnsplashApisEnv = {
  accessKey: UNSPLASH_API_KEY,
}

export default unsplashApisEnv
