import assert from 'assert';
import fs from "fs";
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { SafePackageJson } from './types';

export type InstalledPackageInfo = {
  packageJson: SafePackageJson
  folder: string
}

export type installDirsInfo={
  current:string;
  pkgMng:string;
  pkgMngTmp:string;
}

// imposta le folder sulla cartella riscrivibile 
export function installDirsInfo():installDirsInfo{
  const ignoreFolder = resolve(__dirname, '..', '..', '.ignore')
  assert(fs.existsSync(ignoreFolder))
  const pkgMng = resolve(ignoreFolder, 'pkgmngfolder')
  if(!fs.existsSync(pkgMng)){
    fs.mkdirSync(pkgMng);
  }
  const pkgMngTmp = resolve(pkgMng, 'tmp')
  if(!fs.existsSync(pkgMngTmp)){
    fs.mkdirSync(pkgMngTmp);
  }

  if(fs.existsSync(pkgMngTmp)){
    console.log('tmp folder exist', pkgMngTmp)
  } else throw new Error('cant create folder '+ pkgMngTmp)
  return {current : __dirname, pkgMng, pkgMngTmp }
}

export function getSafeFolderPkgName(packageJson: SafePackageJson) {
  const pkgNameScopeTuple = packageJson.name.split('/').reverse()
  console.log('split pkgNameScopeTuple xxx ',pkgNameScopeTuple );
  console.log('split pkgNameScopeTuple xxx ',pkgNameScopeTuple );
  assert(
    pkgNameScopeTuple.length > 0 &&
      pkgNameScopeTuple.length < 3 &&
      (pkgNameScopeTuple.length === 2 && packageJson.name.startsWith('@')),
    `unexpected package name format ${packageJson.name}`,
  )

  const [name, scope] = pkgNameScopeTuple as [name: string, scope?: string]
  const uid = Math.random().toString(36).substring(2, 8)
  const safeName = `${scope ? `__${scope}__` : ``}${name}`
  const safeInstallationFolder = `${safeName}__${packageJson.version}__${uid}`
  return safeInstallationFolder
}

export async function getPackageInfo(folder: string): Promise<InstalledPackageInfo> {
  const packageJson: SafePackageJson = JSON.parse(await readFile(resolve(folder, 'package.json'), 'utf-8'))
  assert(packageJson.name, 'package has no name')
  assert(packageJson.version, 'package has no version')

  return {
    packageJson,
    folder,
    // info: info.json
  }
}
