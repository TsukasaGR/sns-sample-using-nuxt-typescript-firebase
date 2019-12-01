<template>
  <div class="layouts-navigation">
    <!-- PC:画面上部、SP:画面下部のナビゲーションバー(SP) -->
    <header class="main-navigation">
      <!-- 未ログイン -->
      <template v-if="!isLoggedIn">
        <nuxt-link to="/" class="logo" tag="div">
          <img class="logo-image" :src="logo" />
        </nuxt-link>
        <nuxt-link to="/login" class="navigation-container container-right">
          <Icon
            to="/login"
            icon="sign-in-alt"
            message="ログイン/登録"
            type="horizontal"
          />
        </nuxt-link>
      </template>

      <!-- ログイン後 -->
      <div v-else class="navigation-container">
        <!-- アイコンメニュー -->
        <div class="icons-container">
          <nuxt-link to="/dashboard" tag="div" class="icon-container">
            <Icon icon="tachometer-alt" message="ダッシュボード" />
          </nuxt-link>
          <nuxt-link to="/timeline" tag="div" class="icon-container">
            <Icon icon="users" message="タイムライン" />
          </nuxt-link>
          <div class="icon-container" @click="isModalActive = true">
            <Icon icon="pen" message="投稿" />
          </div>
          <nuxt-link to="/todos" tag="div" class="icon-container">
            <div class="column">
              <span
                v-if="numberOfExpiredScheduleDates > 0"
                class="has-badge-rounded has-badge-danger"
                :data-badge="numberOfExpiredScheduleDates"
              >
                <Icon icon="check" message="やることリスト" />
              </span>
              <Icon v-else icon="check" message="やることリスト" />
            </div>
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

    <b-modal :active.sync="isModalActive" class="write-menu-modal">
      <ul class="write-menu-container">
        <nuxt-link
          :to="`/goals/create`"
          tag="li"
          class="write-menu"
          @click.native="closeModal()"
        >
          <div class="write-menu-icon">
            <Icon
              icon="flag"
              message="目標"
              class="write-menu-icon-item  icon-body"
            />
            <span class="write-menu-icon-item  icon-text">目標</span>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/records/create`"
          tag="li"
          class="write-menu"
          @click.native="closeModal()"
        >
          <div class="write-menu-icon">
            <Icon
              icon="pen"
              message="記録"
              class="write-menu-icon-item icon-body"
            />
            <p class="write-menu-icon-item icon-text">
              記録
            </p>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/retrospectives/create`"
          tag="li"
          class="write-menu"
          @click.native="closeModal()"
        >
          <div class="write-menu-icon">
            <Icon
              icon="reply"
              message="振り返り"
              class="write-menu-icon-item  icon-body"
            />
            <span class="write-menu-icon-item  icon-text">振り返り</span>
          </div>
        </nuxt-link>
      </ul>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AuthState } from '~/store/auth'
import * as types from '~/types/domainTypes'
import Icon from '~/layouts/navigation/containers/icon.vue'
import { expiredScheduleDatesForRealTime } from '~/modules/domains/scheduleDate'

@Component({
  components: { Icon },
})
export default class LayoutsNavigationIndex extends Vue {
  logo: string = require('~/assets/images/logo.png')
  isModalActive: boolean = false

  mounted(): void {
    this.todoData()
  }

  todoData(): void {
    Promise.all([
      this.$store.dispatch('resources/goals/bind', { userId: this.auth.uid }),
      this.$store.dispatch('resources/records/bind', { userId: this.auth.uid }),
      this.$store.dispatch('resources/retrospectives/bind', {
        userId: this.auth.uid,
      }),
      this.$store.dispatch('resources/scheduleDates/bind', {
        userId: this.auth.uid,
      }),
    ]).catch(() => {
      this.$buefy.toast.open('やることリストの取得に失敗しました')
    })
  }

  get auth(): AuthState {
    return this.$store.state.auth
  }
  get isLoggedIn(): boolean {
    return this.$store.state.auth.isLoggedIn
  }
  get goals(): types.Goal[] {
    return this.$store.state.resources.goals.goals
  }
  get records(): types.Record[] {
    return this.$store.state.resources.records.records
  }
  get retrospectives(): types.Retrospective[] {
    return this.$store.state.resources.retrospectives.retrospectives
  }
  get scheduleDates(): types.ScheduleDate[] {
    return this.$store.state.resources.scheduleDates.scheduleDates
  }
  get expiredScheduleDates(): types.ScheduleDate[] {
    return expiredScheduleDatesForRealTime(
      this.scheduleDates,
      this.goals,
      this.records,
      this.retrospectives
    )
  }
  get numberOfExpiredScheduleDates(): number {
    return this.expiredScheduleDates.length
  }

  closeModal(): void {
    this.isModalActive = false
  }
}
</script>

<style lang="scss" scoped>
.layouts-navigation {
  font-size: 0.9rem;

  @include breakpoint() {
    font-size: 0.8rem;
  }

  .logo {
    @include breakpoint(sm) {
      width: 100px;
    }

    @include breakpoint() {
      width: 100px;
      position: absolute;
      left: calc(50% - 50px);
    }
  }

  .container-right {
    width: auto !important;

    @include breakpoint() {
      display: flex;
      width: 100% !important;
      justify-content: flex-end !important;
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
    max-width: 500px;
    bottom: 0;
    background-color: $background-primary-color;

    @include breakpoint(sm) {
      border-top: 1px solid $border-color;
    }

    @include breakpoint() {
      top: 0;
      border-bottom: 1px solid $border-color;
    }

    .navigation-container {
      width: 100%;

      @include breakpoint() {
        max-width: 1200px;
        padding: 0 20px;
      }
    }
  }

  .icons-container {
    width: 100%;
    color: #989797;

    @include breakpoint() {
      width: 50%;
    }

    .icon-container {
      cursor: pointer;
      width: 100%;
      text-align: center;
      font-size: 1rem;
    }
  }

  .header-icon {
    display: flex;
    justify-content: flex-start;
  }

  .write-menu-modal /deep/ {
    .modal-background {
      background-color: $background-primary-color;
    }

    .modal-close {
      &:before,
      &:after {
        background-color: #000;
      }
    }
  }

  .write-menu-container {
    margin: auto;
    width: 90%;
    max-width: 500px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .write-menu {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      .write-menu-icon {
        display: block;
        margin: auto;
        text-align: center;

        .write-menu-icon-item {
          display: block;

          &.icon-body {
            border: 1px solid $border-color;
            line-height: 4.5rem;
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 50%;
            font-size: 1.5rem;
            margin-bottom: 4px;
          }

          &.icon-text {
            font-weight: 900;
          }
        }
      }
    }
  }
}
</style>
