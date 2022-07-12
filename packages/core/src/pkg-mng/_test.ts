import { createPkgMng } from '.';


(async function start(){
    const pkgMng = createPkgMng({ pkgsFolder: '../../.ignore/pkgmngfolder' })

    //
    const ris = await pkgMng.install({type:'npm', registry:'https://registry.npmjs.org', pkgId:'moment' });
    console.log('after install', ris)

})()