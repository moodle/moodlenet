type MNEnv = {
  maxUploadSize: number | null
  minResourcesForUserApprovalRequests: number | null
  timeBetweenApprovalRequests: number | null
  graphqlEndpoint: string
  staticAssetBase: string
}
declare module '@moodlenet/webapp/serverConfigure' {
  export const configure: (_: { mnEnv: MNEnv; customHead?: string }) => {
    defaultIndexFile: string
    staticFolder: string
  }
}
