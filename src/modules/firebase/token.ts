import firebase from '~/modules/firebase'

export function getIdToken(): Promise<string> {
  const auth = firebase.auth()
  const currentUser = auth.currentUser
  if (!currentUser) return new Promise(() => null)
  return currentUser.getIdToken(true)
}
