<template>
  <nuxt-link
    tag="div"
    :to="{ name: 'goals-id', params: { id: goal.objectID } }"
  >
    <div class="goal-container">
      <div class="goal-contents">
        <div class="icon-content">
          <div class="circle">
            <img :src="icon" />
          </div>
          <div>目標公開</div>
        </div>
        <div class="goal-content">
          <div v-if="user" class="name-container">
            <nuxt-link
              tag="div"
              class="user-name"
              :to="`/users/${user.objectID}/profile`"
            >
              <span>{{ user.displayName }}</span>
            </nuxt-link>
            <div class="published-at">
              <span>{{ displayPublishedAt }}</span>
            </div>
          </div>
          <div class="goal-title">
            <span>{{ goal.title }}</span>
            <span>が公開されました</span>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { user } from '~/modules/firebase/firestore/users'
import { displayDatetimeFromFirestoreTimestamp } from '~/modules/dayjs'

@Component({})
export default class TimelineGoalItem extends Vue {
  @Prop({ type: Object, required: true }) goal!: types.Goal
  user: types.User | null = null

  async mounted() {
    this.user = await user(this.goal.userId)
  }

  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }

  get displayPublishedAt() {
    return this.goal.publishedAt
      ? displayDatetimeFromFirestoreTimestamp(this.goal.publishedAt)
      : ''
  }
}
</script>

<style lang="scss" scoped>
.goal-container {
  padding: 1rem;
  width: 100%;
  background: $background-primary-color;
  border-bottom: solid 0.5px $border-color;
  color: $primary-heavy-color;

  .goal-contents {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .icon-content {
      font-size: 0.5rem;
      text-align: center;
      padding-right: 0.5rem;
      width: 15%;

      .circle {
        width: 2.5rem;
        height: 2.5rem;
        margin: auto;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: $border-color;
          object-fit: contain;
        }
      }
    }

    .goal-content {
      width: 85%;
      word-break: break-all;
      font-size: 0.9rem;

      .name-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .user-name {
          font-weight: bold;
          font-size: 0.8rem;
          padding-right: 0.5rem;
        }

        .published-at {
          color: $border-color;
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
