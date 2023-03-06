const { writeFileSync, readdirSync, statSync } = require('fs')
const path = require('path')

const packagesDirs = readdirSync(path.resolve(__dirname, '..', '..')).map(pkg_name =>
  path.resolve(__dirname, '..', '..', pkg_name),
)

function hackPackageJsonExports(recover) {
  console.log('hackPackageJsonExports' + (recover ? ' (recover)' : ''))
  console.log('packagesDirs', packagesDirs, '')
  packagesDirs.forEach(pkgDir => {
    const tsconfigFile = path.resolve(pkgDir, 'tsconfig.json')
    const pkgJsonFile = path.resolve(pkgDir, 'package.json')

    const tsconfigFileExists = !!statSync(tsconfigFile, { throwIfNoEntry: false })
    const pkgJsonFileExists = !!statSync(pkgJsonFile, { throwIfNoEntry: false })
    if (!(tsconfigFileExists && pkgJsonFileExists)) {
      return
    }
    const pkgJson = require(pkgJsonFile)
    const pkgExports = pkgJson.exports
    if (!pkgExports) {
      return
    }
    const pkgExportsStr = JSON.stringify(pkgExports)
    const hackedPkgExportsStr = pkgExportsStr.replaceAll(
      ...(recover ? [`"./src/`, `"./dist/`] : [`"./dist/`, `"./src/`]),
    )
    const hackedExports = JSON.parse(hackedPkgExportsStr)
    pkgJson.exports = hackedExports
    writeFileSync(pkgJsonFile, JSON.stringify(pkgJson, null, 2) + '\n')
  })
}

module.exports = { hackPackageJsonExports }
