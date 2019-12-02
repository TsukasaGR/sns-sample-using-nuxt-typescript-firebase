<template>
  <div class="layouts-navigation">
    <header class="main-navigation">
      <!-- 未ログイン -->
      <div v-if="!isLoggedIn" class="nologin-container">
        <nuxt-link to="/" class="nologin-item logo" tag="div">
          <img class="logo-image" :src="logo" />
        </nuxt-link>
        <nuxt-link to="/login" class="nologin-item">
          <Icon
            to="/login"
            icon="sign-in-alt"
            message="ログイン/登録"
            type="horizontal"
          />
        </nuxt-link>
      </div>

      <!-- ログイン後 -->
      <div v-else class="navigation-container">
        <!-- アイコンメニュー -->
        <div class="icons-container">
          <nuxt-link to="/timeline" tag="div" class="icon-container">
            <Icon icon="users" message="タイムライン" />
          </nuxt-link>
          <nuxt-link
            :to="`/users/${auth.uid}/profile`"
            tag="div"
            class="icon-container"
          >
            <Icon icon="user" message="プロフィール" />
          </nuxt-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AuthState } from '~/store/auth'
import Icon from '~/layouts/navigation/containers/icon.vue'

@Component({
  components: { Icon },
})
export default class LayoutsNavigationIndex extends Vue {
  logo: string = require('~/assets/images/logo.png')
  isModalActive: boolean = false

  mounted(): void {}

  get auth(): AuthState {
    return this.$store.state.auth
  }
  get isLoggedIn(): boolean {
    return this.$store.state.auth.isLoggedIn
  }
}
</script>

<style lang="scss" scoped>
.layouts-navigation {
  font-size: 0.9rem;

  .nologin-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .nologin-item {
      width: 50%;
      text-align: center;

      .logo-image {
        height: calc(56px + env(safe-area-inset-bottom));
        margin-top: 8px;
      }
    }
  }

  .main-navigation,
  .navigation-container,
  .icons-container,
  .search-container,
  .make-ego-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0;
  }

  .main-navigation {
    z-index: 3;
    position: fixed;
    height: calc(56px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;
    max-width: $window-max-width;
    bottom: 0;
    background-color: $background-primary-color;
    border-top: 1px solid $border-color;

    .navigation-container {
      width: 100%;
    }
  }

  .icons-container {
    width: 100%;
    color: #989797;

    .icon-container {
      cursor: pointer;
      width: 100%;
      text-align: center;
      font-size: 1rem;
    }
  }
}
</style>
