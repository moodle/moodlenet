import type { Ext, ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import type { FullRequires } from '@moodlenet/core/src/types/ext'
import type { MainModuleObj, PkgIds, WebappPluginMainModule } from '../types'
import { reactAppPluginMainModule } from './connect-react-app-lib'
import { priHttpFor } from './main-lib/pri-http'
import { pluginMainModules } from './mainContextProviders'

type ConnectArg<MainModule extends WebappPluginMainModule<any, any, any>> = MainModule extends WebappPluginMainModule<
  infer ForExt,
  any,
  any
>
  ? ForExt extends Ext<infer Def, infer Requires>
    ? PluginInfo<Def> & {
        mainModule: MainModule
        requires: FullRequires<Requires>
      }
    : never
  : never

export type PluginInfo<Def extends ExtDef> = {
  id: ExtId<Def>
  name: ExtName<Def>
  version: ExtVersion<Def>
}

const mainModuleObjs: Record<
  string,
  {
    MainModuleObj: MainModuleObj<any>
    ConnectArg: ConnectArg<any>
  }
> = {}

export const connectPkg = <MainModule extends WebappPluginMainModule<any, any, any>>(
  ConnectArg: ConnectArg<MainModule>,
) => {
  // console.log('connectPkg, ConnectArg:', ConnectArg)
  const pkg: PkgIds = {
    id: ConnectArg.id,
    name: ConnectArg.name,
    version: ConnectArg.version,
  }
  const deps = ConnectArg.requires.map(depNames => {
    return mainModuleObjs[depNames.name]?.MainModuleObj.pkgLibFor?.({
      pkg,
    })
  }) as never

  // console.log('connectPkg, deps:', deps)
  const http = priHttpFor(pkg.id)
  const MainModuleObj = ConnectArg.mainModule.connect({
    deps,
    pkg,
    http,
    pkgHttp: priHttpFor,
  })
  // console.log('connectPkg, MainModuleObj:', MainModuleObj)

  mainModuleObjs[ConnectArg.name] = {
    ConnectArg,
    MainModuleObj,
  }
  if (MainModuleObj.MainComponent) {
    pluginMainModules.push({ pkg, MainComponent: MainModuleObj.MainComponent })
  }
  // console.log('connectPkg, mainModuleObjs:', mainModuleObjs)
  console.log(`connected pkg ${ConnectArg.id}`, {
    ConnectArg,
    deps,
    MainModuleObj,
    mainModuleObjs,
  })
}

connectPkg({
  mainModule: reactAppPluginMainModule as any,
  id: '@moodlenet/react-app@0.1.0',
  name: '@moodlenet/react-app',
  version: '0.1.0',
  requires: [] as any,
})

export default connectPkg
