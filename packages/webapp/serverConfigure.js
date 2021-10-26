const copydir = require('copy-dir');
const { readFileSync, writeFileSync, mkdtempSync } = require('fs');
const { tmpdir } = require('os');
const { resolve } = require('path')
module.exports.configure = configure
function configure({ mnEnv = {}, customHead = '' }) {
  const INDEX_HTML = 'index.html'
  const origBuildFolder = resolve(__dirname, 'build')
  const runtimeBuildFolder = mkdtempSync(resolve(tmpdir(), 'moodlenet-webapp-runtime-build-folder'))
  copydir.sync(origBuildFolder, runtimeBuildFolder, {
    utimes: true,
    mode: true,
    cover: true
  });
  const originalIndexHtmlFile = resolve(origBuildFolder, INDEX_HTML)
  const originalIndexHtmlFileString = readFileSync(originalIndexHtmlFile, 'utf-8')

  const interpolatedIndexHtmlFile = resolve(runtimeBuildFolder, INDEX_HTML)


  mnEnv.REACT_APP_CUSTOM_HEAD = `<script>window.__MN_ENV__ = ${JSON.stringify(mnEnv)}</script>${customHead}`
  console.log(mnEnv.REACT_APP_CUSTOM_HEAD)
  const interpolatedIndex = Object.entries(mnEnv).reduce(
    (_html, [key, val]) => _html.replace(new RegExp(`%${key}%`, 'g'), val),
    originalIndexHtmlFileString,
  )

  writeFileSync(interpolatedIndexHtmlFile, interpolatedIndex)

  return {
    defaultIndexFile: interpolatedIndexHtmlFile,
    staticFolder: runtimeBuildFolder,
  }

}

