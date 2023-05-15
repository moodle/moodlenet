### package.json

definire cosa esportare, webapp esporta 3 cose

### pkgConnection

### registry

ESTENDE UN PACKAGE

<registries.settingsSections.Provider> se voglio aghiungere il contenuto a qualcosa già definito ma non popolato,esempio sezione pannello o menu,

o inserisco un elemento a mano un package registra degli elementi reactapp vuole, per esempio: da la possibilità di aggiungere un pagina ad altri package,

pack esterno chiama l'import di registry routers e aggiunge la pagina , reactapp legge il suo registry rooter , e vede gli inserimenti esterni e li usi.

### inti.mts

used from lib

istanzia web pack aggiunge il server express statico a http definisce addWebappPluginItem per aggiungere alla lista esportata

### lib.mts

    called ONLY from main
    import  use-pkg-apis.mts

setupPlugin pluginDef -> { initModuleLoc: string[]; deps: Deps; }

add package in pluginDef in list in this type : WebappPluginDef<Deps> & { guestPkgInfo: PackageInfo; guestPkgId: PkgIdentifier<any>; }

get/set Appreance -> ??? REMOVE !!!!

### web-lib.mjs

cosa vuole esportare verso l'esterno per esempio qui auth plugins ecc per esempio, mi serve sapere l'auth. e mi importo da webApp context auth fa da interfaccia e definisce la compatibilità con altri moduli

### core/registry,mts

used by main.mts and connect.mts

PKG_REG_ENTRIES lista packages getPkgRegEntryByPkgName registerPkg push into PKG_REG_ENTRIES ensureRegisterPkg register if not exit packages

listEntries export PKG_REG_ENTRIES

TUTTI I PACKAGE CHE SONO STATI AVVIATI con conncet package dopo che sono stati registrati.

### web-lib/registry,mts

espone la funzionalità di registry della webapp (no core) usato registeres.mts

### webapp/registries.mts

utilizza registry sopra per definire i registers della webapp

### use-pkg-apis.mts

used by lib.mts

utillizza delle api esportate da core che utilizzato core/registry.mts ma solo quelli che servono al pack corrente, E LE INIZIALIZZA QUI esempio apperanceData prepara uno store per essa.

httpSrvPkg prende il riferimento a http, ma l'inizializzaione sta su init.mts

kvPkg --> keyValuePackage write data in store take ./types/data.mjs and define keys from data get api from package with pkgConnection get kvStore store, from package kvspkg api from package export kvspkg, kvStore

### api.mts

used by main getAppereange, setAppreance, plugin

### main.mts

used by context/maincontext.mts

setup react-app with this define : WebPkgDeps -> list of object for direct access to default export from package { pkgId, pluginDef: { initModuleLoc: ['dist', 'webapp', 'MainComponent.js'], deps: WebPkgDeps, },

export self package (value of pkgId )

### mainContext.tsx

used by main.mjs (CIRCULAR REFERENCE), MainComponent

deine types WebPkgDeps -> list depency types MainContextT

export react context with data from api.mts

### core/src/main/boot.mts

entry point del processo, chiama tutti i main definiti in pack json quindo questo main si estende con tutti quelli degli altri packages

produce packge.json c0on tutti i package e li risolv

### react-app/src/webapp/ui.mts

packages/react-app/src/webapp/components.mts export similar

//TODO //@ALE //@ETTO

il package dovrebbe avere 3 cartelle, common, webapp, server
