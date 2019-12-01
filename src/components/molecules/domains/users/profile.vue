<template>
  <div class="molecules-domains-users-profile">
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
      <div v-if="teams" class="team-container">
        <Icon icon="users" class="team-icon" />
        <b-taglist>
          <b-tag v-for="(team, index) in teams" :key="index">
            <a @click="linkTeams(team.objectID)">
              {{ team.name }}
            </a>
          </b-tag>
        </b-taglist>
      </div>
      <div class="description">
        <AtomsDescription :description="user.description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import AtomsDescription from '~/components/atoms/Description.vue'
import Icon from '~/layouts/navigation/containers/icon.vue'

@Component({
  components: {
    AtomsDescription,
    Icon,
  },
})
export default class MoleculesDomainsUsersProfile extends Vue {
  @Prop({ type: Object, required: true }) user!: types.User
  @Prop({ type: Array, required: false, default: [] }) teams!: types.Team[]

  linkTeams(teamId: string): void {
    console.log(teamId)
    this.$router.push(`/teams?teamId=${teamId}`)
  }

  get icon(): string {
    return this.user && this.user.icon && this.user.icon !== 'null'
      ? this.user.icon
      : 'https://firebasestorage.googleapis.com/v0/b/woven-mapper-232901.appspot.com/o/image%2Fuser-icon1.png?alt=media&token=20949804-68fe-4892-9a81-3c02295bb4f3'
  }
}
</script>

<style lang="scss" scoped>
.molecules-domains-users-profile {
  @include breakpoint(sm) {
    padding: 1rem;
  }

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  .icon-container {
    display: flex;
    justify-content: center;
    background: #fff;
    width: 30%;

    @include breakpoint(md) {
      width: 100px;
    }

    .user-icon {
      width: 5rem;
      height: 5rem;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .summary-container {
    width: 70%;
    margin-top: 0.5rem;

    @include breakpoint() {
      width: calc(100% - 100px);
    }

    @include breakpoint(sm) {
      color: #4a4a4a;
    }

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

    .team-container {
      display: flex;
      .team-icon {
        font-size: 0.9rem;
        margin-right: 8px;
      }
    }

    .description {
      font-size: 0.8rem;

      @include breakpoint(sm) {
      }
    }
  }
}
</style>
