<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left />
    <template v-slot:header-center>
      <p>ログイン</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <section class="pages-login">
        <div class="page-title">
          ログイン/登録
        </div>
        <client-only placeholder="Loading...">
          <FirebaseUi />
        </client-only>
      </section>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import FirebaseUi from '~/components/containers/login/FirebaseUi.vue'

@Component({
  components: {
    BasePageTemplate,
    FirebaseUi,
  },
})
export default class PagesLogin extends Mixins(BasePage) {
  mounted(): void {
    this.startPageMounted()
    if (this.$store.state.auth.isLoggedIn) this.$router.push('/timeline')
    this.endPageMounted()
  }
}
</script>

<style lang="scss" scoped>
.pages-login {
  width: 100%;
  margin: 0 auto;

  @include breakpoint(sm) {
    min-height: calc(100vh - 66px);
  }

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;

  .page-title {
    font-size: 1.2rem;
    font-weight: bold;
  }
}
</style>
