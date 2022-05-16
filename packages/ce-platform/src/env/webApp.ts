import unsplashApisEnv from './unsplashApis'

const customHead = process.env.REACT_APP_CUSTOM_HEAD

const mnStatic: { customHead?: string; webappEnv: MNEnv } = {
  customHead,
  webappEnv: {
    maxUploadSize: parseIntOrNull(process.env.ASSET_UPLOADER_MAX_SIZE),
    timeBetweenApprovalRequests: parseIntOrNull(process.env.TIME_BETWEEN_APPROVAL_REQUESTS),
    minResourcesForUserApprovalRequests: parseIntOrNull(process.env.MIN_RESOURCES_FOR_USER_APPROVAL_REQUESTS),
    staticAssetBase: process.env.STATIC_ASSET_BASE ?? '/assets',
    graphqlEndpoint: process.env.GRAPHQL_ENDPOINT ?? '/graphql',
    unsplashEndpoint: unsplashApisEnv.accessKey ? process.env.UNSPLASH_ENDPOINT ?? '/unsplash' : null,
  },
}

export default mnStatic

function parseIntOrNull(_?: string) {
  const int = parseInt(_ ?? '#')
  return isNaN(int) ? null : int
}
