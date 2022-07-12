import execa from 'execa';
import { mkdtemp } from 'fs/promises';
import https from 'https';
import os from 'os';
import path from 'path';
import tar from 'tar';
import { PkgTmpInstaller, _InstallPkgReq } from './types';
export type InstallPkgReq = NpmInstallReq | FolderInstallReq

export type NpmInstallReq = _InstallPkgReq<'npm', { registry: string; pkgId: string }>
export const npmTmpInstaller: PkgTmpInstaller<NpmInstallReq> = async npmInstallReq => {


  const tmpInstallationFolder = await mkdtemp(path.resolve(os.tmpdir(), 'foo-'))
  console.log('tmp install folder  = ', tmpInstallationFolder)

  // npmInstallReq
  // throw new Error('not implemented')
  await downLoadNpm(npmInstallReq.pkgId, tmpInstallationFolder)

  return { tmpInstallationFolder }
}

export type FolderInstallReq = _InstallPkgReq<'folder', { fromFolder: string }>
export const folderTmpInstaller: PkgTmpInstaller<FolderInstallReq> = async folderInstallReq => {
  // make tmpfolder

  const tmpInstallationFolder = await mkdtemp(path.resolve(os.tmpdir(), 'foo-'))
  console.log('tmp install folder  = ', tmpInstallationFolder)

  folderInstallReq
  return { tmpInstallationFolder }
  //throw new Error('not implemented')
}

export function downLoadNpm(lib: string, folder: string) {
  // npm v fs  dist.tarball
  return execa('npm', ['v', lib, 'dist.tarball']).then(resp => {
    console.log('down lib', resp.stdout)
    https.get(resp.stdout, function (response) {
      response.pipe(tar.x({ strip: 1, C: folder }))
    })
  })
}


/*
const https = require("https");
const tar = require("tar");

https.get("https://url.to/your.tar.gz", function(response) {
  response.pipe(
    tar.x({
      strip: 1,
      C: "some-dir"
    })
  );
});
*/
