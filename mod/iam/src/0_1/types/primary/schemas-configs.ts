export interface PrimaryMsgSchemaConfigs {
  user: {
    email: { max: number; min: number }
    password: { max: number; min: number }
    displayName: { max: number; min: number }
  }
  myAccount: {
    selfDeletionRequestReason: { max: number; min: number }
  }
}
