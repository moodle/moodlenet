const boot = require("@moodlenet/main").default
const prompt = require('prompt');
const path = require('path');
const fs = require('fs');

const RESTART_EXIT_CODE = 9999
const DEPLOYMENTS_FOLDER_BASE = path.resolve(__dirname, '.machines')
const LAST_DEPLOYMENT_FOLDERNAME_FILE = path.resolve(DEPLOYMENTS_FOLDER_BASE, '.LAST_DEPLOYMENT_FOLDER')
const DEV_LOCK_FILE = path.resolve(DEPLOYMENTS_FOLDER_BASE, '.DEV_LOCK_FILE ')

const lastDeploymentFolderName = (() => { try { return fs.readFileSync(LAST_DEPLOYMENT_FOLDERNAME_FILE, { encoding: 'utf-8' }) } catch { return '' } })()
const hasLock = fs.existsSync(DEV_LOCK_FILE)

fs.writeFileSync(DEV_LOCK_FILE, '')

prompt.start();

(async () => {
  let __rest = false
  process.on('message', (message) => {
    console.log('Restarting...')
    process.exit(RESTART_EXIT_CODE)
  });
  process.on('exit', (code) => {
    if (code !== RESTART_EXIT_CODE) {
      console.log('#### EXIT ####')
      fs.unlinkSync(DEV_LOCK_FILE)
    }
  });

  console.log({ hasLock, lastDeploymentFolderName });
  const { deploymentFolderName } = hasLock && lastDeploymentFolderName
    ? { deploymentFolderName: lastDeploymentFolderName }
    : await prompt.get([{
      default: lastDeploymentFolderName,
      type: 'string',
      description: 'deployment folder',
      name: 'deploymentFolderName'
    }]).catch(() => process.exit())

  const deploymentFolder = path.resolve(DEPLOYMENTS_FOLDER_BASE, deploymentFolderName)

  console.log({ deploymentFolder })
  if (!(fs.existsSync(deploymentFolder) && fs.lstatSync(deploymentFolder).isDirectory())) {
    throw new Error(`${deploymentFolder} is not a dir`)
  }

  if (lastDeploymentFolderName !== deploymentFolderName) {
    fs.writeFileSync(LAST_DEPLOYMENT_FOLDERNAME_FILE, deploymentFolderName)
  }

  boot({ deploymentFolder })

})()


