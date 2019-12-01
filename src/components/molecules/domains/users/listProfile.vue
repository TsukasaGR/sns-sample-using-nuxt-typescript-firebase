<template>
  <div class="molecules-domains-users-list-profile">
    <div class="icon-container">
      <img class="icon" :src="imageUrl" />
    </div>
    <div class="summary-container">
      <p class="name">
        {{ user.displayName }}
      </p>
      <p class="username">
        {{ user.accountName ? '@' + user.accountName : '' }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import AtomsUserIcon from '~/components/atoms/UserIcon.vue'

@Component({
  components: {
    AtomsUserIcon,
  },
})
export default class MoleculesDomainsUsersListProfile extends Vue {
  @Prop(Object) user!: types.User

  get imageUrl(): string {
    return this.user && 'icon' in this.user && this.user.icon
      ? this.user.icon
      : 'https://firebasestorage.googleapis.com/v0/b/woven-mapper-232901.appspot.com/o/image%2Fuser-icon1.png?alt=media&token=20949804-68fe-4892-9a81-3c02295bb4f3'
  }
}
</script>

<style lang="scss" scoped>
.molecules-domains-users-list-profile {
  display: flex;
  align-items: center;
  padding-bottom: 1rem;

  .icon-container {
    width: 10%;
    height: auto;
    margin-right: 0.5rem;

    .icon {
      object-fit: cover;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
    }
  }

  .summary-container {
    width: 80%;

    .name {
      font-size: 0.8rem;
      font-weight: bold;
    }

    .username {
      font-size: 0.8rem;
    }
  }
}
</style>
