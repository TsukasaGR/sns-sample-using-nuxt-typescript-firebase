<template>
  <div class="molecules-pages-login-firebase-ui">
    <div id="firebaseui-auth-container" />
    <div id="loader" :class="{ none: isLoaded }">
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'

@Component
export default class MoleculesPagesLoginFirebaseUi extends Vue {
  isLoaded: boolean = false

  mounted(): void {
    this.initFirebaseUi()
  }

  /**
   * firebaseuiを初期化
   * @see https://github.com/firebase/firebaseui-web
   */
  initFirebaseUi(): void {
    // firebaseuiはSSR時は動かず、importしてしまうとclient-onlyタグで囲んでいても読み込まれてしまうのでrequireで読み込んでいる
    const firebaseui = require('firebaseui')
    const uiConfig = {
      // TODO: 細かい設定はあとで行う
      callbacks: {
        signInSuccessWithAuthResult: res => {
          const returnUser: any = res.user
          const auth: types.Auth = {
            uid: returnUser.uid,
            refreshToken: returnUser.refreshToken,
            displayName: returnUser.displayName,
            email: returnUser.email,
            emailVerified: returnUser.emailVerified,
            photoURL: returnUser.photoURL,
            isLoggedIn: true,
          }
          this.$store.commit('auth/setAuth', auth)
          return true // trueを返さないとsingInSuccessUrlにリダイレクトされないので必ずtrueを返す
        },
        signInFailure: err => {
          console.log(err)
          return false
        },
        uiShown: () => {
          this.isLoaded = true
        },
      },
      signInSuccessUrl: '/timeline',
      tosUrl: '/', // TODO: 利用規約ページのリンクだがどういう動きをするのかわかっていない
      privacyPolicyUrl: '/', // TODO: プライバシーポリシーページのリンクだがどういう動きをするのかわかっていない
      signInFlow: 'redirect', // redirect or popup
      // signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID]
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    }
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

<style lang="scss" scoped>
.molecules-pages-login-firebase-ui {
  .none {
    display: none;
  }

  .firebaseui-card-content {
    padding: 0;
  }
}
</style>
