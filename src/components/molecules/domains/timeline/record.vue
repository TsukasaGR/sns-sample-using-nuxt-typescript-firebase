<template>
  <nuxt-link v-if="user" tag="div" :to="`/records/${record.objectID}`">
    <div class="record-container">
      <div class="record-contents">
        <div class="icon-content">
          <div class="circle">
            <img :src="icon" />
          </div>
          <div>記録</div>
        </div>
        <div class="record-content">
          <div class="name-container">
            <nuxt-link
              tag="div"
              class="user-name"
              :to="`/users/${user.objectID}/profile`"
            >
              <span>{{ user.displayName }}</span>
            </nuxt-link>
            <div class="created-date">
              <span>{{ displayCreatedAt }}</span>
            </div>
          </div>
          <nuxt-link
            v-if="goal"
            tag="div"
            class="goal-title"
            :to="`/goals/${goal.objectID}`"
          >
            <span>#{{ goal.title }}</span>
          </nuxt-link>
          <div class="comment-container">
            <!-- -webkit-box-orientはstyle内に入れてしまうとビルド時に消えてしまう、かつautoprefixer: offを設定するとビルド時にwarningが発生するためStyle直書きとしている -->
            <!-- @see https://oar.st40.xyz/article/236 -->
            <div class="comment" style="-webkit-box-orient: vertical;">
              <span>{{ record.comment }}</span>
            </div>
          </div>
          <div v-if="record.image" class="image-container">
            <img :src="record.image" />
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { goal } from '~/modules/firebase/firestore/goals'
import { user } from '~/modules/firebase/firestore/users'
import { displayTimestamp } from '~/modules/dayjs'

@Component({})
export default class TimelineRecordItem extends Vue {
  @Prop({ type: Object, required: true }) record!: types.Record
  goal: types.Goal | null = null
  user: types.User | null = null

  async mounted() {
    await this.getGoal()
    await this.getUser()
  }
  async getGoal() {
    if (!this.record.goalId) return false
    this.goal = await goal(this.record.goalId)
  }
  async getUser() {
    if (this.goal) this.user = await user(this.goal.userId)
  }

  get displayCreatedAt() {
    return displayTimestamp(this.record.createdAt)
  }

  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }
}
</script>

<style lang="scss" scoped>
.record-container {
  padding: 1rem;
  width: 100%;
  background: $background-primary-color;
  border-bottom: solid 0.5px $border-color;

  .record-contents {
    display: flex;
    justify-content: flex-start;

    .icon-content {
      font-size: 0.5rem;
      text-align: center;
      width: 15%;
      padding-right: 0.5rem;

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

    .record-content {
      color: $primary-heavy-color;
      word-break: break-all;
      font-size: 0.9rem;
      width: 85%;

      .name-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0.5rem;

        .user-name {
          font-weight: bold;
          padding-right: 0.5rem;
        }

        .created-date {
          color: $border-color;
          font-size: 0.8rem;
        }
      }

      .goal-title {
        font-weight: bold;
        margin-right: 0.5rem;
        font-size: 0.8rem;
        padding-bottom: 0.5rem;
        color: $primary-light-color;
        text-align: left;
      }
    }
  }

  .comment-container {
    display: flex;
    justify-content: flex-end;
    overflow: hidden;

    .comment {
      width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-align: left;
    }
  }

  .image-container {
    img {
      width: 50%;
      max-height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
}
</style>
