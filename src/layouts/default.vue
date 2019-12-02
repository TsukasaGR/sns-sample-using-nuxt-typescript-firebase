<template>
  <client-only>
    <div class="layouts-default">
      <Navigation />
      <Loader />
      <div
        :class="{ 'content-container-un-login': !isLoggedIn }"
        class="content-container"
      >
        <nuxt v-if="isShow" class="page-container" />
        <template v-else>
          <p>
            お使いのブラウザでご利用頂けません。Chrome、Edge等他のブラウザでご利用ください。
          </p>
        </template>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navigation from '~/layouts/navigation/index.vue'
import Loader from '~/components/handlers/loader.vue'

@Component({
  components: {
    Navigation,
    Loader,
  },
})
export default class LayoutsDefault extends Vue {
  isShow: boolean = true

  mounted(): void {
    this.noPinchZoom()
    this.noDoubleTap()
  }
  get isLoggedIn(): boolean {
    return this.$store.state.auth.isLoggedIn
  }
  canBrowse(): void {
    // IEでは見れないようにする
    const userAgent = window.navigator.userAgent.toLowerCase()
    this.isShow = !userAgent.includes('msie')
  }
  noPinchZoom(): void {
    // iOSでピンチズームが有効化してしまう不具合の対応
    document.addEventListener(
      'touchstart',
      event => {
        if (event.touches.length > 1) {
          event.preventDefault()
        }
      },
      true
    )
  }
  noDoubleTap(): void {
    let lastTouch = 0
    document.addEventListener(
      'touchend',
      event => {
        const now = window.performance.now()
        if (now - lastTouch <= 500) {
          event.preventDefault()
        }
        lastTouch = now
      },
      true
    )
  }
}
</script>

<style lang="scss" scoped>
.layouts-default {
  width: 100%;
  margin: auto;

  .content-container {
    &.content-container-un-login {
      margin-top: 0;
      margin-bottom: 0;
    }

    .page-container {
      z-index: 1;
    }
  }
}
</style>
