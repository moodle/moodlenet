### inti.mts
used from lib

istanzia web pack
aggiunge il server express statico a http
definisce addWebappPluginItem per aggiungere alla lista esportata

### lib.mts
    called ONLY from main
    import  use-pkg-apis.mts

setupPlugin
pluginDef -> { mainComponentLoc: string[];
    usesPkgs: Deps;
    }

add package in pluginDef in list in this type :
WebappPluginDef<Deps> & {
    guestPkgInfo: PackageInfo;
    guestPkgId: PkgIdentifier<any>;
}

get/set Appreance -> ??? REMOVE !!!!

### registry,mts
used by main.mts and connect.mts

PKG_REG_ENTRIES lista packages
getPkgRegEntryByPkgName
registerPkg push into PKG_REG_ENTRIES
ensureRegisterPkg register if not exit packages

listEntries export PKG_REG_ENTRIES

### use-pkg-apis.mts
used by lib.mts

write data in store
take ./types/data.mjs
and define keys from data
get api from package with pkgConnection
get kvStore store, from package
kvspkg api from package
export kvspkg, kvStore

### api.mts
used by main
getAppereange, setAppreance, plugin

### main.mts
used by context/maincontext.mts

setup react-app with this define :
WebPkgDeps -> list of object for direct access to default export from package
{
  pkgId,
  pluginDef: {
    mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
    usesPkgs: WebPkgDeps,
  },

export  self package (value of  pkgId )

### mainContext.tsx
used by main.mjs (CIRCULAR REFERENCE), MainComponent

deine types
WebPkgDeps -> list depency types
MainContextT

export react context with data from api.mts
