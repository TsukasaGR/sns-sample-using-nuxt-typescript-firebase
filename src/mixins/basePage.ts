import { Component, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { updateUser } from '~/apis/users'

const NOT_AUTH_PATH_LIST = ['/', '/login']

@Component
export default class extends Vue {
  isInitialized: boolean = false
  notAuthPathList: string[] = NOT_AUTH_PATH_LIST

  startPageMounted(): void {
    this.$store.commit('loading/updateState', true)
  }

  endPageMounted(): void {
    this.isInitialized = true
    this.$store.commit('loading/updateState', false)
  }

  async loginCheck(): Promise<void> {
    if (!this.$store.state.auth.uid) {
      if (!this.notAuthPathList.includes(this.$route.path))
        this.$router.push('/login')
    }
    if (!this.$store.state.auth.user) {
      await this.$store.dispatch('auth/getUser')
      if (!this.$store.state.auth.user) {
        const userDraft: types.User = {
          objectID: this.$store.state.auth.uid,
          accountName: this.$store.state.auth.displayName,
          displayName: this.$store.state.auth.displayName,
          icon:
            this.$store.state.auth.photoURL &&
            this.$store.state.auth.photoURL !== 'null'
              ? this.$store.state.auth.photoURL
              : null,
          description: '',
          createdAt: timestampOfCurrentTime(),
          createdUser: this.$store.state.auth.uid,
        }
        const user = await updateUser(userDraft)
        if (!user) {
          this.$rollbar.error('ユーザー登録に失敗しました', user)
          this.$buefy.toast.open('予期せぬエラーが発生しました😭😭😭')
          this.$router.push('/login')
        } else {
          // 初回ログインの想定
          this.$rollbar.debug('ユーザーが新規登録されました', user)
          await this.$store.dispatch('auth/getUser')
        }
      }
    }
  }

  get isShow(): boolean {
    return this.isInitialized && !this.$store.state.loading.isLoad
  }

  failedUpdate() {
    this.$buefy.toast.open('更新出来ませんでした')
    this.$store.commit('loading/updateState', false)
  }
}
