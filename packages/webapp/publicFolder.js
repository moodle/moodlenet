const { resolve } = require("path")

const publicFolder = resolve(__dirname, 'build')
module.exports = [publicFolder, resolve(publicFolder, 'index.html')]
