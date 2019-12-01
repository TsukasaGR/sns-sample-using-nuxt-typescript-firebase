<template>
  <b-tabs
    position="is-centered"
    expanded
    :class="{
      'tab-list-2split': !showActivity,
      'tab-list-3split': showActivity,
    }"
  >
    <b-tab-item v-if="showActivity" label="アクティビティ">
      <div>
        <ActivityItem :goal="goal" />
      </div>
    </b-tab-item>
    <b-tab-item label="記録">
      <div v-if="recordExists">
        <div v-for="(record, index) in records" :key="index">
          <RecordItem :record="record" />
        </div>
      </div>
      <div v-else class="text">
        記録がありません
      </div>
    </b-tab-item>
    <b-tab-item label="振り返り">
      <div v-if="retrospectivesExists">
        <div v-for="(retrospective, index) in retrospectives" :key="index">
          <RetrospectiveItem :retrospective="retrospective" />
        </div>
      </div>
      <div v-else class="text">
        振り返りがありません
      </div>
    </b-tab-item>
  </b-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import ActivityItem from '~/components/molecules/domains/goals/activityItem.vue'
import RecordItem from '~/components/molecules/domains/timeline/record.vue'
import RetrospectiveItem from '~/components/molecules/domains/timeline/retrospective.vue'

@Component({
  components: {
    ActivityItem,
    RecordItem,
    RetrospectiveItem,
  },
})
export default class PagesGoals extends Vue {
  @Prop({ type: Object, required: false, default: undefined }) goal!: types.Goal
  @Prop({ type: Array, required: true }) records!: types.Record[]
  @Prop({ type: Array, required: true }) retrospectives!: types.Retrospective[]

  get recordExists(): boolean {
    return this.records.length !== 0
  }

  get retrospectivesExists(): boolean {
    return this.retrospectives.length !== 0
  }

  get showActivity(): boolean {
    return this.goal !== undefined
  }
}
</script>

<style lang="scss" scoped>
.tab-list-2split /deep/ {
  li {
    width: 50%;
  }
}
.tab-list-3split /deep/ {
  li {
    width: 33.333%;
  }
}
</style>
