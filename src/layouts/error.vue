<template>
  <section class="layouts-error">
    <div class="content-container">
      <div class="message-container">
        <template v-if="error.statusCode && error.statusCode === 404">
          <p>
            🙈ページが見つかりません🙈
          </p>
          <p>
            🙏URLを確認して再度アクセスしてみてください🙏
          </p>
        </template>
        <template v-else>
          <p>
            😱エラーが発生しました😱
          </p>
          <p>
            🙏Habitttチームがエラーを確認致しますので、今しばらくお待ち下さい🙏
          </p>
        </template>
      </div>
      <div class="button-container">
        <button class="button is-success" @click="goHome()">
          トップページへ
        </button>
        <button class="button is-danger" @click="logout()">
          ログアウト
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import firebase from '~/plugins/firebase'

@Component
export default class LayoutsError extends Vue {
  @Prop(Object) error: any

  mounted(): void {
    const message: string = this.error.message || 'error page😈'
    if (this.error.statusCode && this.error.statusCode === 404)
      this.$rollbar.warning(message, this.error)
    else this.$rollbar.error(message, this.error)
    this.$store.commit('pageLoading/updateState', false)
  }

  goHome(): void {
    this.$router.push('/')
  }

  logout(): void {
    // prettier-ignore
    firebase.auth().signOut().then(() => {
      this.$store.commit('auth/clearAuth')
      this.$router.push('/login')
    }).catch(error => {
      this.$rollbar.error(error)
      this.$buefy.toast.open('ログアウトに失敗しました')
    })
  }
}
</script>

<style lang="scss">
.layouts-error {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .content-container {
    .message-container {
      padding: 20px;

      p {
        font-weight: 900;
        font-size: 1.3rem;

        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
