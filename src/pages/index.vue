<template>
  <section v-if="isShow" class="pages-index">
    <div class="logo-container">
      <img class="logo-image" :src="logo" />
      <p class="sub-title">
        「チーム」×「習慣」で目標をアップデートする
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PagesIndex extends Vue {
  isShow = false
  logo: string = require('~/assets/images/logo.png')
  mounted(): void {
    if (this.$store.state.auth.isLoggedIn) this.$router.push('/timeline')
    else this.isShow = true
  }
}
</script>

<style lang="scss" scoped>
.pages-index {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .logo-container {
    text-align: center;

    .logo-image {
      width: 70%;
      height: auto;
      object-fit: cover;
    }

    .sub-title {
      color: #73ae87;
    }
  }
}
</style>
