<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>プロフィール</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <section>
        <div v-if="user">
          <div class="top-container">
            <Profile class="profile" :user="user" :teams="teams" />
            <div class="plof-container">
              <div class="plofbutton">
                <AtomsButton
                  v-if="isOwn"
                  class="only-sp"
                  value="プロフィールを編集する"
                  color="is-sub"
                  @click="editProfile(user.objectID)"
                />
              </div>
            </div>
            <template v-if="isAdmin">
              <div class="plof-container">
                <div class="plofbutton">
                  <AtomsButton
                    class="only-sp"
                    value="チームを設定する"
                    color="is-sub"
                    @click="$router.push('/teams/edit')"
                  />
                </div>
              </div>
              <div class="plof-container">
                <div class="plofbutton">
                  <AtomsButton
                    class="only-sp"
                    value="Admin"
                    color="is-sub"
                    @click="$router.push('/admin')"
                  />
                </div>
              </div>
            </template>
          </div>
          <TabList
            :goals="goals"
            :timeline="timeline"
            :records="records"
            :retrospectives="retrospectives"
            :schedule-dates="scheduleDates"
          />
        </div>
        <div v-if="isOwn" class="logout-container">
          <button class="button" @click="logout">
            ログアウト
          </button>
        </div>
      </section>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import * as consts from '~/constants/domainInits'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { user } from '~/modules/firebase/firestore/users'
import { storeOrUpdateUser } from '~/apis/users'
import Profile from '~/components/molecules/domains/users/profile.vue'
import AtomsButton from '~/components/atoms/Button.vue'
import ListProfile from '~/components/molecules/domains/users/listProfile.vue'
import firebase from '~/plugins/firebase'
import GoalItem from '~/components/molecules/domains/timeline/goal.vue'
import RecordItem from '~/components/molecules/domains/timeline/record.vue'
import RetrospectiveItem from '~/components/molecules/domains/timeline/retrospective.vue'
import { goalsOfUser } from '~/modules/firebase/firestore/goals'
import { recordsOfUser } from '~/modules/firebase/firestore/records'
import { retrospectivesOfUser } from '~/modules/firebase/firestore/retrospectives'
import { isDraft, isPublished, isArchived } from '~/modules/domains/goal'
import TabList from '~/components/molecules/domains/users/tabList.vue'
import { timelineOfUser } from '~/modules/domains/timeline'
import { scheduleDatesOfUser } from '~/modules/firebase/firestore/scheduleDates'
import { teamsOfUser } from '~/modules/domains/teams/index'
import { isAdmin } from '~/modules/domains/users/index'

@Component({
  components: {
    BasePageTemplate,
    Profile,
    AtomsButton,
    ListProfile,
    GoalItem,
    RecordItem,
    RetrospectiveItem,
    TabList,
  },
})
export default class PagesUsersIdProfile extends Mixins(BasePage) {
  activeTab: number = 0
  user: types.User | types.UserDraft = { ...consts.USER_INIT_VALUE }

  goals: types.Goal[] = []
  records: types.Record[] = []
  retrospectives: types.Retrospective[] = []
  timeline: types.Timeline[] = []
  scheduleDates: types.ScheduleDate[] = []
  teams: types.Team[] = []

  tab: types.GoalStatus = 'published'

  async getGoals() {
    if (!this.user.objectID) return
    this.goals = await goalsOfUser(this.user.objectID)
  }
  async getRecords() {
    if (!this.user.objectID) return
    this.records = await recordsOfUser(this.user.objectID)
  }
  async getRetrospectives() {
    if (!this.user.objectID) return
    this.retrospectives = await retrospectivesOfUser(this.user.objectID)
  }
  async getTimeline() {
    if (!this.user.objectID) return
    this.timeline = await timelineOfUser(this.user.objectID)
  }
  async getScheduleDates() {
    if (!this.user.objectID) return
    this.scheduleDates = await scheduleDatesOfUser(this.user.objectID)
  }
  async getTeams() {
    if (!this.user.objectID) return
    this.teams = await teamsOfUser(this.user.objectID)
  }

  async mounted() {
    this.startPageMounted()
    await this.getUser()
    await Promise.all([
      this.getGoals(),
      this.getRecords(),
      this.getRetrospectives(),
      this.getTimeline(),
      this.getScheduleDates(),
      this.getTeams(),
    ])
    this.endPageMounted()
  }

  get auth(): types.Auth {
    return this.$store.state.auth
  }
  get isOwn(): boolean {
    return this.auth.uid === this.user.objectID
  }
  get isAdmin(): boolean {
    return this.user && isAdmin(this.user as types.User)
  }
  // TODO: 公開済みより公開中の意味合いが強いのでshowingとかのほうが良いかも
  get publishedGoals() {
    return this.goals.filter((goal: types.Goal) => isPublished(goal))
  }
  get draftGoals() {
    return this.goals.filter((goal: types.Goal) => isDraft(goal))
  }
  get archivedGoals() {
    return this.goals.filter((goal: types.Goal) => isArchived(goal))
  }

  async getUser(): Promise<void> {
    this.user = await user(this.$route.params.id)
    if (!this.user || !this.user.objectID) this.logout()
  }

  async storeUser(): Promise<void> {
    const user: types.User = {
      objectID: this.auth.uid,
      accountName: this.auth.displayName,
      displayName: this.auth.displayName,
      email: this.auth.email,
      icon: this.auth.photoURL,
      description: '',
      createdAt: timestampOfCurrentTime(),
      role: '',
      createdUser: '',
    }
    await storeOrUpdateUser(user)
  }

  editProfile(id: number) {
    this.$router.push(`/users/${id}/edit`)
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
