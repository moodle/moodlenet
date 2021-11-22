declare module '@moodlenet/webapp/serverConfigure' {
  export type MNEnv = {
    graphqlEndpoint: string
    staticAssetBase: string
  }
  export const configure: (_: {
    mnEnv?: Partial<MNEnv>
    customHead?: string
  }) => { defaultIndexFile: string; staticFolder: string }
}
