import { Ext, ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import { FullRequires } from '@moodlenet/core/src/types/ext'
import { MainModuleObj, WebappPluginMainModule } from '../types'
import { reactAppPluginMainModule } from './connect-react-app-lib'

type ConnectArg<MainModule extends WebappPluginMainModule<any, any>> = MainModule extends WebappPluginMainModule<
  infer ForExt,
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

const connectPkg = <MainModule extends WebappPluginMainModule<any, any>>(ConnectArg: ConnectArg<MainModule>) => {
  // console.log('connectPkg, ConnectArg:', ConnectArg)

  const deps = ConnectArg.requires.map(depNames => {
    return mainModuleObjs[depNames.name]?.MainModuleObj.pkgLibFor?.({
      extId: ConnectArg.id,
      extName: ConnectArg.name,
      extVersion: ConnectArg.version,
    })
  }) as never

  // console.log('connectPkg, deps:', deps)

  const MainModuleObj = ConnectArg.mainModule.connect({
    deps,
    _: ConnectArg.name,
  })
  // console.log('connectPkg, MainModuleObj:', MainModuleObj)

  mainModuleObjs[ConnectArg.name] = {
    ConnectArg,
    MainModuleObj,
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
  mainModule: reactAppPluginMainModule,
  id: '@moodlenet/react-app@0.1.0',
  name: '@moodlenet/react-app',
  version: '0.1.0',
  requires: [] as any,
})

export default connectPkg
