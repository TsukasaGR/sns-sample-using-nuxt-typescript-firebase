<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>チーム情報</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div class="pages-teams-index">
        <b-field label="チームを選択する">
          <b-select v-model="team" placeholder="Select a Team">
            <option v-for="(team, index) in teams" :key="index" :value="team">
              {{ team.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="メンバー">
          <MemberList :contents="contents" />
        </b-field>
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import { allTeam, team as getTeam } from '~/modules/firebase/firestore/teams'
import { publishedGoalsOfUser } from '~/modules/firebase/firestore/goals'
import MemberList from '~/components/molecules/domains/teams/membersList.vue'

@Component({
  components: {
    BasePageTemplate,
    MemberList,
  },
})
export default class PagesTeamsIndex extends Mixins(BasePage) {
  teams: types.Team[] = []
  team: types.Team | null = null
  contents: any[] = []

  async mounted(): Promise<void> {
    await this.initialize()
  }

  async initialize(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    await this.getAllTeam()
    await this.getTeam()
    this.endPageMounted()
  }

  async getAllTeam(): Promise<void> {
    this.teams = await allTeam()
  }

  async getTeam(): Promise<void> {
    if (
      this.$route.query &&
      this.$route.query.teamId &&
      this.teams.find(team => team.objectID === this.$route.query.teamId)
    ) {
      this.team = await getTeam(this.$route.query.teamId as string)
    }
  }

  @Watch('team')
  async changedTeam() {
    if (!this.team || !this.team.members) return

    this.startPageMounted()
    for (const user of this.team.members) {
      await publishedGoalsOfUser(user.objectID).then(publishedGoals => {
        const contentUser: types.UserWithGoals = {
          ...user,
          goals: publishedGoals,
        }
        this.contents.push(contentUser)
      })
    }
    this.endPageMounted()
  }
}
</script>
