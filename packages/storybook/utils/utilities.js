// import { readdirSync, writeFileSync } from 'fs'
// import path from 'path'

// const test = path
// const packagesDirs = readdirSync(path.join('..')).map(pkg_name => path.join('..', pkg_name))
// // .map(pkg_name => path.join('..', pkg_name))
// console.log(test)
// hackPackageJsonExports()

// export function hackPackageJsonExports(recover) {
//   console.log('hackPackageJsonExports' + (recover ? ' (recover)' : ''))
//   console.log(packagesDirs)
//   packagesDirs.forEach(pkgDir => {
//     const pkgJsonFile = path.resolve(pkgDir, 'package.json')
//     const pkgExports = pkgJsonFile.exports
//     if (!pkgExports) {
//       return
//     }
//     const pkgExportsStr = JSON.stringify(pkgExports)
//     const hackedPkgExportsStr = pkgExportsStr.replaceAll(
//       ...(recover ? [`"./src/`, `"./dist/`] : [`"./dist/`, `"./src/`]),
//     )
//     const hackedExports = JSON.parse(hackedPkgExportsStr)
//     pkgJsonFile.exports = hackedExports
//     writeFileSync(pkgJsonFile, JSON.stringify(pkgJsonFile, null, 2) + '\n')
//   })
// }
