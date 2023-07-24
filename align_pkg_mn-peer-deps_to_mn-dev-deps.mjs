import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import * as path from 'path'

// https://github.com/lerna/lerna/issues/1892
// https://github.com/lerna/lerna/issues/3014
// https://github.com/lerna/lerna/issues/1575

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const packagesDirs = readdirSync(path.resolve(__dirname, 'packages')).map(pkg_name =>
  path.resolve(__dirname, 'packages', pkg_name),
)

packagesDirs.forEach(pkgDir => {
  console.log('pkgDir', pkgDir)
  const pkgJsonFile = path.resolve(pkgDir, 'package.json')
  const pkgJsonFileExists = !!statSync(pkgJsonFile, { throwIfNoEntry: false })
  if (!pkgJsonFileExists) return

  const pkgJson = JSON.parse(readFileSync(pkgJsonFile, 'utf8'))
  const hasMNDevDeps = !!Object.keys(pkgJson.devDependencies ?? {}).find(depName =>
    depName.startsWith('@moodlenet/'),
  )
  if (!hasMNDevDeps) return

  Object.keys(pkgJson.peerDependencies ?? {}).forEach(depName => {
    if (depName.startsWith('@moodlenet/')) delete pkgJson.peerDependencies[depName]
  })

  Object.keys(pkgJson.devDependencies).forEach(depName => {
    if (!depName.startsWith('@moodlenet/')) return
    pkgJson.peerDependencies = pkgJson.peerDependencies ?? {}
    pkgJson.peerDependencies[depName] = pkgJson.devDependencies[depName]
  })

  writeFileSync(pkgJsonFile, JSON.stringify(pkgJson, null, 2) + '\n')
})
