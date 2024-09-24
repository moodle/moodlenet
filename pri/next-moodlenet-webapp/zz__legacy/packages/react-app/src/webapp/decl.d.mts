declare module '_connect-moodlenet-pkg-modules_' {
  export type PluginMainInitializerObject = {
    init(): Promise<unknown>
    pkgId: PkgIdentifier
    deps: { [depName: string]: { targetPkgId: PkgIdentifier; rpcPaths: string[] } }
  }
  declare const plugins: PluginMainInitializerObject[]
  export default plugins
}
