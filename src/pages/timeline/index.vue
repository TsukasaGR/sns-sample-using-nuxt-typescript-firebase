<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left />
    <template v-slot:header-center>
      <p>タイムライン</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div class="pages-timeline">
        timeline
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
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import ActionButton from '~/components/presentations/actionButton.vue'
import CommentModal from '~/components/presentations/commentModal.vue'
import { storeComment } from '~/apis/comments'
import { Auth, CommentDraft } from '~/types/domainTypes'
import { timestampOfCurrentTime } from '~/modules/dayjs'

@Component({
  components: {
    BasePageTemplate,
    ActionButton,
    CommentModal,
  },
})
export default class PagesTimeline extends Mixins(BasePage) {
  isModalActive = false
  commentBody = ''

  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    this.endPageMounted()
  }

  initialize(): void {
    this.isModalActive = false
    this.commentBody = ''
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
}
</script>

<style lang="scss" scoped>
.pages-timeline {
  margin: 0 auto;
}
</style>
