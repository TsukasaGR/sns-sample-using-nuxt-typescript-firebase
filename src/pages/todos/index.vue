<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left />
    <template v-slot:header-center>
      <p>やることリスト</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <section class="pages-todos">
        <template v-if="expiredScheduleDates.length === 0">
          <div class="no-todo">
            <p>やることリストはありません</p>
          </div>
        </template>
        <template v-else>
          <ScheduleItem
            v-for="(expiredScheduleDate, index) in expiredScheduleDates"
            :key="index"
            :schedule-date="expiredScheduleDate"
          />
        </template>
      </section>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import ScheduleItem from '~/components/molecules/domains/todos/item.vue'
import { AuthState } from '~/store/auth'
import * as types from '~/types/domainTypes'
import { expiredScheduleDatesForRealTime } from '~/modules/domains/scheduleDate'

@Component({
  components: {
    BasePageTemplate,
    ScheduleItem,
  },
})
export default class PagesTodos extends Mixins(BasePage) {
  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    this.endPageMounted()
  }

  get auth(): AuthState {
    return this.$store.state.auth
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
}
</script>

<style lang="scss" scoped>
.pages-todos {
  .no-todo {
    text-align: center;
    padding: 1rem;
  }
}
</style>
