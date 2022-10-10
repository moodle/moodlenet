import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { fixModuleLocForWebpackByOS } from './util.mjs';
function ___dirname(import_meta_url) {
    return fileURLToPath(new URL('.', import_meta_url));
}
const __dirname = ___dirname(import.meta.url);
export function generateConnectPkgModulesModule({ plugins }) {
    return `// - generated ConnectPkgsModule for ${plugins.map(_ => _.guestPkgInfo.pkgId.name).join(',')} -

  // import {pluginMainComponents} from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'webapp', 'mainContextProviders.tsx'))}'
  // import {pluginMainComponents} from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'lib', 'webapp', 'mainContextProviders.js'))}'

 

  ${plugins
        .map((pluginItem, index) => `
import pkg_main_component_${index} from '${resolve(pluginItem.guestPkgInfo.pkgRootDir, ...pluginItem.mainComponentLoc)}' // ${pluginItem.guestPkgInfo.pkgId.name}
    `)
        .join('')}

    const pkgs = []
    export default {
      pkgs 
    }

  ${plugins
        .map((pluginItem, index) => `


// connect ${pluginItem.guestPkgInfo.pkgId.name} (pkg_main_component_${index})
pkgs.push({
  //@ts-ignore
  MainComponent:pkg_main_component_${index},
  pkgId:${JSON.stringify(pluginItem.guestPkgInfo.pkgId)},
  usesPkgs: ${JSON.stringify(pluginItem.usesPkgs.map(({ pkgInfo: { pkgId } }) => ({ pkgId })))}
})

`)
        .join('')}
console.log('\\n--------- all pkgs connected ---------\\n\\n')
`;
}
//# sourceMappingURL=generateConnectPkgsModuleModule.mjs.map