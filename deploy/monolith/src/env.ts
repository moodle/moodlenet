export function get_dbs_struct_configs_0_1() {
  return {
    data: {
      url: process.env.ARANGODB_DATA_URL ?? 'http://127.0.0.1:8529',
      dbname: process.env.ARANGODB_DATA_NAME ?? 'data',
    },
    iam: {
      url: process.env.ARANGODB_IAM_URL ?? 'http://127.0.0.1:8529',
      dbname: process.env.ARANGODB_IAM_NAME ?? 'iam',
    },
  }
}
