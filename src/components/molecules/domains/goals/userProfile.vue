<template>
  <div>
    <b-field class="select-tab-container">
      <b-select v-model="tab" class="select-tab">
        <option value="published" selected>
          公開中の目標
        </option>
        <option value="draft">
          下書き中の目標
        </option>
        <option value="archived">
          アーカイブ済みの目標
        </option>
      </b-select>
    </b-field>

    <div class="tab-container">
      <template v-if="tab === 'published'">
        <nuxt-link
          v-for="(goal, index) in publishedGoals"
          :key="index"
          :to="`/goals/${goal.objectID}`"
        >
          <GoalItem :goal="goal" />
        </nuxt-link>
      </template>
      <template v-else-if="tab === 'draft'">
        <nuxt-link
          v-for="(goal, index) in draftGoals"
          :key="index"
          :to="`/goals/${goal.objectID}`"
        >
          <GoalItem :goal="goal" />
        </nuxt-link>
      </template>
      <template v-else-if="tab === 'archived'">
        <nuxt-link
          v-for="(goal, index) in archivedGoals"
          :key="index"
          :to="`/goals/${goal.objectID}`"
        >
          <GoalItem :goal="goal" />
        </nuxt-link>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import firebase from '~/plugins/firebase'
import GoalItem from '~/components/molecules/domains/timeline/goal.vue'
import { isDraft, isPublished, isArchived } from '~/modules/domains/goal'

@Component({
  components: {
    BasePageTemplate,
    GoalItem,
  },
})
export default class PagesUsersIdProfile extends Vue {
  @Prop({ type: Array, required: true }) goals!: types.Goal[]
  activeTab: number = 0
  tab: types.GoalStatus = 'published'

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
