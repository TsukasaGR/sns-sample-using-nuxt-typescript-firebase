<template>
  <b-tabs position="is-centered" expanded class="tab-list">
    <!-- TODO: 後日きちんとしたものを実装予定だが、現状レイアウトが決まっていないのでひとまずコメントアウトしておく -->
    <!-- <b-tab-item label="アクティビティ">
      <UserActivity
        :records="records"
        :retrospectives="retrospectives"
        :schedule-dates="scheduleDates"
      />
    </b-tab-item> -->
    <b-tab-item label="目標">
      <UserProfile :goals="goals" />
    </b-tab-item>
    <b-tab-item label="タイムライン">
      <TimelineItems :timeline="timeline" />
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import UserProfile from '~/components/molecules/domains/goals/userProfile.vue'
import TimelineItems from '~/components/molecules/domains/timeline/items.vue'
import UserActivity from '~/components/molecules/domains/users/activity.vue'

@Component({
  components: {
    UserActivity,
    UserProfile,
    TimelineItems,
  },
})
export default class PagesUsers extends Vue {
  @Prop({ type: Array, required: true }) goals!: types.Goal[]
  @Prop({ type: Array, required: true }) timeline!: types.Timeline[]
  @Prop({ type: Array, required: true }) records!: types.Record[]
  @Prop({ type: Array, required: true }) retrospectives!: types.Retrospective[]
  @Prop({ type: Array, required: true }) scheduleDates!: types.ScheduleDate[]
}
</script>

<style lang="scss" scoped>
.tab-list /deep/ {
  li {
    width: 50%;
  }
}
</style>
