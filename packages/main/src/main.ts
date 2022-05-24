import boot from '.'

const deploymentFolder = process.env.WD_DEPLOYMENT_FOLDER ?? process.cwd()

boot({ deploymentFolder })
