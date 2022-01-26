const customHead = process.env.REACT_APP_CUSTOM_HEAD

const mnStatic: { customHead?: string; webappEnv: MNEnv } = {
  customHead,
  webappEnv: {
    maxUploadSize: Number(process.env.ASSET_UPLOADER_MAX_SIZE ?? 10485760),
    timeBetweenApprovalRequests: Number(process.env.TIME_BETWEEN_APPROVAL_REQUESTS ?? 1000 * 60 * 60 * 24 * 14),
    minResourcesForUserApprovalRequests: Number(process.env.MIN_RESOURCES_FOR_USER_APPROVAL_REQUESTS ?? 5),
    staticAssetBase: process.env.STATIC_ASSET_BASE ?? '/assets',
    graphqlEndpoint: process.env.GRAPHQL_ENDPOINT ?? '/graphql',
  },
}

export default mnStatic
