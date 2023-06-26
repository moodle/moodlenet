import { execa } from 'execa'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import {
  defaultCorePackages,
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
  const defaultCorePackageWithVersion = await Promise.all(
    defaultCorePackages.map(async pkgName => {
      const fullPkgName = `@moodlenet/${pkgName}`
      const version = devInstallLocalRepoSymlinks
        ? `file:${resolve(myPkgDir, '..', pkgName)}`
        : (await execa('npx', ['-y', 'npm@8', 'view', fullPkgName, 'dist-tags.latest'])).stdout
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
    creatorVersion: myPkgJson.version,
    scripts: {
      start: `node start.mjs`,
    },
    dependencies,
  }
}
