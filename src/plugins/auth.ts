import { Store } from 'vuex'
import { AuthState } from '~/store/auth'
import firebase from '~/plugins/firebase'

export default async ({ store }: { store: Store<any> }) => {
  const user = await auth()
  if (user) {
    const auth: AuthState = {
      uid: user.uid,
      refreshToken: user.refreshToken,
      displayName: String(user.displayName),
      email: String(user.email),
      emailVerified: String(user.emailVerified),
      photoURL: String(user.photoURL),
      isLoggedIn: true,
    }
    await store.commit('auth/setAuth', auth)
  }
  await store.commit('initialize/done')
}

/**
 * 認証情報を取得し、Promiseを返す
 * @see https://firebase.google.com/docs/auth/web/manage-users?hl=ja
 */
function auth(): Promise<firebase.User | null> {
  // onAuthStateChangedそのままだとPromiseを返さないのでここでラップしてPromiseを返す
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      // 認証済みであればuserが、未認証であればnullが返る
      resolve(user)
    })
  })
}
