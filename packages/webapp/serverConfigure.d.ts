type MNEnv = {
  maxUploadSize: number
  minResourcesForUserApprovalRequests: number
  timeBetweenApprovalRequests: number
  graphqlEndpoint: string
  staticAssetBase: string
}
declare module '@moodlenet/webapp/serverConfigure' {
  export const configure: (_: { mnEnv: MNEnv; customHead?: string }) => {
    defaultIndexFile: string
    staticFolder: string
  }
}
