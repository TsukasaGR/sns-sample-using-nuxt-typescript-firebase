<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left />
    <template v-slot:header-center>
      <p>プロフィール</p>
    </template>
    <template v-slot:header-right>
      <b-button v-if="isOwn" @click="editProfile()">
        Edit
      </b-button>
    </template>
    <template v-slot:content>
      <UserProfile :user="user" />
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import UserProfile from '~/components/presentations/userProfile.vue'
import * as types from '~/types/domainTypes'
import * as consts from '~/constants/domainInits'
import { user } from '~/modules/firebase/firestore/users'
import firebase from '~/modules/firebase'

@Component({
  components: {
    BasePageTemplate,
    UserProfile,
  },
})
export default class PagesUsersIdProfile extends Mixins(BasePage) {
  activeTab: number = 0
  user: types.User | types.UserDraft = { ...consts.USER_INIT_VALUE }

  async mounted() {
    this.startPageMounted()
    await this.getUser()
    this.endPageMounted()
  }

  get auth(): types.Auth {
    return this.$store.state.auth
  }
  get isOwn(): boolean {
    return this.auth.uid === this.user.objectID
  }

  async getUser(): Promise<void> {
    this.user = await user(this.$route.params.id)
    if (!this.user || !this.user.objectID) this.logout()
  }

  editProfile() {
    this.$router.push(`/users/${this.$route.params.id}/edit`)
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

<style lang="scss" scoped>
.layouts-default {
  .content-container {
    .page-container {
      padding: 0;

      @include breakpoint() {
        max-width: 590px !important;
      }
    }
  }
}

.top-container {
  @include breakpoint() {
    display: flex;
    align-items: center;
    max-width: 720px;
    margin: auto;
    padding-top: 2rem;
  }

  .profile {
    @include breakpoint() {
      width: 50%;
    }
  }

  .plof-container {
    display: flex;
    justify-content: flex-end;
    padding: 0 1rem 1rem 1rem;

    .plofbutton {
      width: 70%;

      @include breakpoint() {
        width: 50%;
      }
    }
  }
}

.item {
  cursor: pointer;
}

.logout-container {
  margin: 3rem 1rem 1rem;
  text-align: right;
}

.create-goal-link {
  width: 100%;
}

.select-tab-container {
  width: 100%;

  .select-tab /deep/ {
    width: 100%;
    margin-bottom: 1rem;

    .select,
    select {
      width: 100%;
    }
  }
}
</style>
