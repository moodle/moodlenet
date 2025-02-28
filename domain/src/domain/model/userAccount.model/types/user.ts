export type userId = string
export type userProfileInfo = {
  displayName: string
}

export type userProfile = {
  info: userProfileInfo
  avatar: moo.content.asset.optional
  background: moo.content.asset.optional
}
