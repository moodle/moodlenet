import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { defaultCorePackages } from '../defaultCorePackages.mjs'
import {
  devInstallLocalRepoSymlinks,
  installationName,
  installDir,
  myPkgDir,
  myPkgJson,
} from '../env.mjs'

const installPkgJson = await freshInstallPkgJson()
await writeFile(resolve(installDir, 'package.json'), JSON.stringify(installPkgJson, null, 2), {
  encoding: 'utf8',
})

async function freshInstallPkgJson() {
  const defaultCorePackageWithVersion = Object.entries(defaultCorePackages).map(([pkgName, v]) => {
    const fullPkgName = `@moodlenet/${pkgName}`
    const version = devInstallLocalRepoSymlinks ? `file:${resolve(myPkgDir, '..', pkgName)}` : v

    return {
      fullPkgName,
      version,
    }
  })

  const dependencies = defaultCorePackageWithVersion.reduce((_, { fullPkgName, version }) => {
    return {
      ..._,
      [fullPkgName]: version,
    }
  }, {})

  return {
    name: installationName,
    version: '1',
    creatorVersion: myPkgJson.version,
    scripts: {
      start: `node start.mjs`,
    },
    dependencies,
  }
}
