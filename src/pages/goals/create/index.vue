<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div>
        <div>
          <div class="select-title">
            目標を選ぶ
          </div>
          <div class="goal-select-container">
            <nuxt-link to="/goals/create/step1" class="goal-item" tag="div">
              <SelectGoalItemDetail title="新規作成" :icon="createIcon" />
            </nuxt-link>
            <nuxt-link
              v-for="(goal, index) in goals"
              :key="index"
              :to="`/goals/${goal.objectID}/edit/step1`"
              tag="div"
              class="goal-item"
            >
              <SelectGoalItem :goal="goal" />
            </nuxt-link>
          </div>
        </div>
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SelectGoalItem from '~/components/molecules/domains/goals/selectItem.vue'
import SelectGoalItemDetail from '~/components/molecules/domains/goals/selectItemDetail.vue'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import { AuthState } from '~/store/auth'
import * as types from '~/types/domainTypes'
import { goalsOfUser } from '~/modules/firebase/firestore/goals'

const GOALS_CREATE_ICON: string =
  'https://firebasestorage.googleapis.com/v0/b/habittt-b66b4.appspot.com/o/%E3%83%95%E3%82%9A%E3%83%A9%E3%82%B9%E3%81%AE%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E7%B4%A0%E6%9D%90.png?alt=media&token=8a24ee83-ba14-447c-94eb-1905303e7b28'
@Component({
  components: {
    BasePageTemplate,
    SelectGoalItem,
    SelectGoalItemDetail,
  },
})
export default class GoalsCreateIndex extends Mixins(BasePage) {
  createIcon = GOALS_CREATE_ICON
  goals: types.Goal[] = []
  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    this.goals = await goalsOfUser(this.auth.uid)
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
