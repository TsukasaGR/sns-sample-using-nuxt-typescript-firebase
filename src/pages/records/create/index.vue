<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>記録する</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div>
        <div v-if="goals.length === 0">
          目標がありません
        </div>
        <div v-else>
          <div class="select-title">
            目標を選ぶ
          </div>
          <div class="goal-select-container">
            <div v-for="(goal, index) in goals" :key="index" class="goal-item">
              <nuxt-link :to="`/records/create/goal/${goal.objectID}`">
                <SelectGoalItem :goal="goal" />
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SelectGoalItem from '~/components/molecules/domains/goals/selectItem.vue'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import { AuthState } from '~/store/auth'
import * as types from '~/types/domainTypes'
import { publishedGoalsOfUser } from '~/modules/firebase/firestore/goals'

@Component({
  components: {
    BasePageTemplate,
    SelectGoalItem,
  },
})
export default class CreateRecordIndex extends Mixins(BasePage) {
  goals: types.Goal[] = []
  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    this.goals = await publishedGoalsOfUser(this.auth.uid)
    this.endPageMounted()
  }

  get auth(): AuthState {
    return this.$store.state.auth
  }
}
</script>
<style lang="scss" scoped>
.select-title {
  margin: 0.7rem;
  font-weight: bold;
}

.goal-select-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .goal-item {
    width: 50%;
  }
}
</style>
