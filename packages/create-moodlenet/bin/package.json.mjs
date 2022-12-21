import execa from 'execa'
import { resolve } from 'path'
import {
  myModuleDir,
  installationName,
  myPkgJson,
  devInstallLocalRepoSymlinks,
  defaultCorePackages,
  installDir,
} from './env.mjs'
import { writeFile } from 'fs/promises'

const installPkgJson = await freshInstallPkgJson()
await writeFile(resolve(installDir, 'package.json'), JSON.stringify(installPkgJson, null, 2), {
  encoding: 'utf8',
})

async function freshInstallPkgJson() {
  const defaultCorePackageWithVersion = await Promise.all(
    defaultCorePackages.map(async pkgName => {
      const fullPkgName = `@moodlenet/${pkgName}`
      const version = devInstallLocalRepoSymlinks
        ? `file:${resolve(myModuleDir, '..', '..', pkgName)}`
        : (await execa('npm', ['view', fullPkgName, 'dist-tags.latest'])).stdout
      return {
        fullPkgName,
        version,
      }
    }),
  )

  const dependencies = defaultCorePackageWithVersion.reduce((_, { fullPkgName, version }) => {
    return {
      ..._,
      [fullPkgName]: version,
    }
  }, {})

  return {
    name: installationName,
    version: '1',
    installTimeVersion: myPkgJson.version,
    scripts: {
      start: `node start.mjs`,
    },
    dependencies,
    devDependencies: {
      'dotenv': '^16.0.3',
      'dotenv-expand': '^10.0.0',
    },
  }
}
