import { resolve } from 'path'

const corePkgs = [
  ['http-server', '0.0.1'],
  ['kernel', '0.0.1'],
  ['pri-http', '0.0.1'],
  ['react-app', '0.0.1'],
]

export function npmCorePkgList({ _DEV_MODE_CORE_PKGS_FROM_FOLDER }: { _DEV_MODE_CORE_PKGS_FROM_FOLDER?: boolean }) {
  return corePkgs.map(([pkgName, version]) => {
    if (_DEV_MODE_CORE_PKGS_FROM_FOLDER) {
      const dev_folder = resolve(__dirname, '..', '..')
      return `file:${dev_folder}/${pkgName}`
    } else {
      return `${pkgName}@${version}`
    }
  })
}
