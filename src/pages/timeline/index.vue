<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left />
    <template v-slot:header-center>
      <p>タイムライン</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div class="pages-timeline">
        <TimelineItem
          v-for="(comment, index) in filteredComments"
          :key="index"
          :comment="comment"
          class="timeline-item"
        />
      </div>
    </template>
    <template v-slot:action>
      <ActionButton icon="comment" @button-click="toggleModal(true)" />
      <b-modal
        :active.sync="isModalActive"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <CommentModal
          :body.sync="commentBody"
          :can-post="canPost"
          @close-modal="toggleModal(false)"
          @comment="postComment()"
        />
      </b-modal>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import ActionButton from '~/components/presentations/actionButton.vue'
import CommentModal from '~/components/presentations/commentModal.vue'
import TimelineItem from '~/components/presentations/timelineItem.vue'
import { storeComment } from '~/apis/comments'
import { Auth, CommentDraft, Comment } from '~/types/domainTypes'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { sortComments } from '~/modules/domains/comments'

@Component({
  components: {
    BasePageTemplate,
    ActionButton,
    CommentModal,
    TimelineItem,
  },
})
export default class PagesTimeline extends Mixins(BasePage) {
  isModalActive = false
  commentBody = ''
  // comments: Comment[] = []

  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    await this.bind()
    this.endPageMounted()
  }

  async destroyed() {
    await this.unbind()
  }

  initialize(): void {
    this.isModalActive = false
    this.commentBody = ''
  }

  async bind(): Promise<void> {
    // this.comments = await allComments('desc')
    await this.$store.dispatch('domains/timeline/bind')
  }

  async unbind(): Promise<void> {
    await this.$store.dispatch('domains/timeline/unbind')
  }

  toggleModal(value): void {
    this.isModalActive = value
  }

  async postComment(): Promise<void> {
    const comment: CommentDraft = {
      objectID: null,
      createdAt: timestampOfCurrentTime(),
      createdUser: this.auth.uid,
      body: this.commentBody,
    }

    this.startPageMounted()
    await storeComment(comment).finally(() => this.endPageMounted())
    this.$buefy.toast.open('コメントしました🎉')
    this.initialize()
  }

  get auth(): Auth {
    return this.$store.state.auth
  }

  get canPost(): boolean {
    return this.commentBody !== ''
  }

  get comments(): Comment[] {
    return this.$store.state.domains.timeline.comments
  }

  get filteredComments(): Comment[] {
    return sortComments(cloneDeep(this.comments), 'desc')
  }
}
</script>

<style lang="scss" scoped>
.pages-timeline {
  .timeline-item {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
}
</style>
