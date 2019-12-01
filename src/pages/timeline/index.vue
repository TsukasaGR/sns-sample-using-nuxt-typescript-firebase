<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left />
    <template v-slot:header-center>
      <p>タイムライン</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <TimelineItems :timeline="timeline" />
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import { timeline as timelineData } from '~/modules/domains/timeline'
import TimelineItems from '~/components/molecules/domains/timeline/items.vue'

@Component({
  components: {
    BasePageTemplate,
    TimelineItems,
  },
})
export default class PagesTimeline extends Mixins(BasePage) {
  timeline: types.Timeline[] = []

  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    await this.setTimeline()
    this.endPageMounted()
  }

  async setTimeline(): Promise<void> {
    this.timeline = await timelineData()
  }
}
</script>

<style lang="scss" scoped>
.pages-timeline {
  margin: 0 auto;
}
</style>
