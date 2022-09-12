import { Ext, ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import { FullRequires } from '@moodlenet/core/src/types/ext'
import { MainModuleObj, WebappPluginMainModule } from '../types'
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

const connectPkg = <MainModule extends WebappPluginMainModule<any, any, any>>(ConnectArg: ConnectArg<MainModule>) => {
  // console.log('connectPkg, ConnectArg:', ConnectArg)
  const extId = ConnectArg.id
  const extName = ConnectArg.name
  const extVersion = ConnectArg.version
  const deps = ConnectArg.requires.map(depNames => {
    return mainModuleObjs[depNames.name]?.MainModuleObj.pkgLibFor?.({
      extId,
      extName,
      extVersion,
    })
  }) as never

  // console.log('connectPkg, deps:', deps)
  const http = priHttpFor(extId)
  const MainModuleObj = ConnectArg.mainModule.connect({
    deps,
    extId,
    extName,
    extVersion,
    http,
    pkgHttp: priHttpFor,
  })
  // console.log('connectPkg, MainModuleObj:', MainModuleObj)

  mainModuleObjs[ConnectArg.name] = {
    ConnectArg,
    MainModuleObj,
  }
  if (MainModuleObj.MainComponent) {
    pluginMainModules.push({ extId, MainComponent: MainModuleObj.MainComponent })
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
