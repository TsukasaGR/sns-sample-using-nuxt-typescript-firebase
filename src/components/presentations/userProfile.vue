<template>
  <div class="card">
    <div class="molecules-domains-users-profile card-content">
      <div class="icon-container">
        <img :src="icon" class="user-icon" />
      </div>
      <div class="summary-container">
        <div class="name-container">
          <p class="name">
            {{ user.displayName }}
          </p>
          <p class="username">
            {{ user.accountName ? '@' + user.accountName : '' }}
          </p>
        </div>
        <div class="description">
          {{ user.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { icon } from '~/modules/domains/users'

@Component
export default class PresentationsUserProfile extends Vue {
  @Prop({ type: Object, required: true }) user!: types.User

  get icon(): string {
    return icon(this.user)
  }
}
</script>

<style lang="scss" scoped>
.molecules-domains-users-profile {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  .icon-container {
    display: flex;
    justify-content: center;
    background: #fff;
    width: 30%;

    .user-icon {
      width: 5rem;
      height: 5rem;
      object-fit: cover;
    }
  }

  .summary-container {
    width: 70%;
    margin-top: 0.5rem;

    .name-container {
      padding-bottom: 0.5rem;

      .name {
        font-size: 1.2rem;
        font-weight: bold;
        word-wrap: break-word;

        @include breakpoint() {
          display: inline-block;
        }
      }

      .username {
        font-size: 1rem;
        word-wrap: break-word;

        @include breakpoint() {
          display: inline-block;
        }
      }
    }

    .description {
      font-size: 0.8rem;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
}
</style>
