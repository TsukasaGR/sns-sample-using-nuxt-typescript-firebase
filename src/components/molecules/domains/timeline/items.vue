<template>
  <section v-if="timeline.length > 0" class="pages-timeline">
    <div v-for="(item, index) of slicedTimeline" :key="index">
      <nuxt-link v-if="isGoal(item)" :to="`/goals/${item.objectID}`">
        <GoalItem :goal="item" />
      </nuxt-link>
      <RecordItem v-else-if="isRecord(item)" :record="item" />
      <RetrospectiveItem
        v-else-if="isRetrospective(item)"
        :retrospective="item"
      />
    </div>
    <InfiniteLoading @infinite="infiniteHandler">
      <div slot="spinner">
        Loading...
      </div>
      <div slot="no-more">
        No more message
      </div>
      <div slot="no-results">
        No results message
      </div>
    </InfiniteLoading>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import InfiniteLoading from 'vue-infinite-loading'
import * as types from '~/types/domainTypes'
import { isGoal, isRecord, isRetrospective } from '~/modules/domains/timeline'
import GoalItem from '~/components/molecules/domains/timeline/goal.vue'
import RecordItem from '~/components/molecules/domains/timeline/record.vue'
import RetrospectiveItem from '~/components/molecules/domains/timeline/retrospective.vue'

@Component({
  components: {
    GoalItem,
    RecordItem,
    RetrospectiveItem,
    InfiniteLoading,
  },
})
export default class TimelineItems extends Vue {
  @Prop({ type: Array, required: true }) timeline!: types.Timeline[]
  pageCount: number = 1
  itemsPerPage: number = 50

  isGoal(item: types.Timeline): boolean {
    return isGoal(item)
  }
  isRecord(item: types.Timeline): boolean {
    return isRecord(item)
  }
  isRetrospective(item: types.Timeline): boolean {
    return isRetrospective(item)
  }

  get slicedTimeline(): types.Timeline[] {
    return this.timeline.slice(0, this.itemsPerPage * this.pageCount)
  }

  infiniteHandler($state) {
    this.pageCount += 1
    return this.timeline.length > this.pageCount * this.itemsPerPage
      ? $state.loaded()
      : $state.complete()
  }
}
</script>

<style lang="scss" scoped>
.pages-timeline {
  margin: 0 auto;
}
</style>
