import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import * as path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const packagesDirs = readdirSync(path.resolve(__dirname, 'packages')).map(pkg_name =>
  path.resolve(__dirname, 'packages', pkg_name),
)

packagesDirs.forEach(pkgDir => {
  if (pkgDir.match('/storybook$') || pkgDir.match('/v2-migrate-v3$')) {
    return
  }
  console.log('pkgDir', pkgDir)
  const pkgJsonFile = path.resolve(pkgDir, 'package.json')
  const pkgJsonFileExists = !!statSync(pkgJsonFile, { throwIfNoEntry: false })
  if (!pkgJsonFileExists) return
  const tsconfigJsonFile = path.resolve(pkgDir, 'tsconfig.json')
  const tsconfigJsonFileExists = !!statSync(tsconfigJsonFile, { throwIfNoEntry: false })
  if (!tsconfigJsonFileExists) return

  const pkgJson = JSON.parse(readFileSync(pkgJsonFile, 'utf8'))
  const tsconfigJson = JSON.parse(readFileSync(tsconfigJsonFile, 'utf8'))

  tsconfigJson.references = [
    ...new Set(
      Object.keys({
        ...pkgJson.devDependencies,
        ...pkgJson.peerDependencies,
        ...pkgJson.dependencies,
      }).filter(depName => depName.startsWith('@moodlenet/')),
    ),
  ].map(_ => ({ path: `../${_.replace(/^@moodlenet\//, '')}` }))

  writeFileSync(tsconfigJsonFile, JSON.stringify(tsconfigJson, null, 2) + '\n')
})
