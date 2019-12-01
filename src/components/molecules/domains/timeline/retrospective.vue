<template>
  <nuxt-link
    v-if="user"
    tag="div"
    :to="`/retrospectives/${retrospective.objectID}`"
  >
    <div class="retrospective-container">
      <div class="retrospective-contents">
        <div class="icon-content">
          <div class="circle">
            <img :src="icon" />
          </div>
          <div>振り返り</div>
        </div>
        <div class="retrospective-content">
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
          <div class="achieverate">
            達成率:
            {{ retrospective.achieveRate }}%
          </div>
        </div>
      </div>
      <div class="comment-container">
        <!-- -webkit-box-orientはstyle内に入れてしまうとビルド時に消えてしまう、かつautoprefixer: offを設定するとビルド時にwarningが発生するためStyle直書きとしている -->
        <!-- @see https://oar.st40.xyz/article/236 -->
        <div class="comment" style="-webkit-box-orient: vertical;">
          <span>{{ retrospective.comment }}</span>
        </div>
      </div>
      <div v-if="retrospective.image" class="image-container">
        <img :src="retrospective.image" />
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { goal } from '~/modules/firebase/firestore/goals'
import { displayTimestamp } from '~/modules/dayjs'
import { user } from '~/modules/firebase/firestore/users'

@Component({})
export default class TimelineRetrospectiveItem extends Vue {
  @Prop({ type: Object, required: true }) retrospective!: types.Retrospective
  goal: types.Goal | null = null
  user: types.User | null = null

  async mounted() {
    await this.getGoal()
    await this.getUser()
  }

  async getGoal() {
    if (!this.retrospective.goalId) return false
    this.goal = await goal(this.retrospective.goalId)
  }
  async getUser() {
    if (this.goal) this.user = await user(this.goal.userId)
  }

  get displayCreatedAt() {
    return displayTimestamp(this.retrospective.createdAt)
  }

  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }
}
</script>

<style lang="scss" scoped>
.retrospective-container {
  padding: 1rem;
  width: 100%;
  background: $background-primary-color;
  border-bottom: solid 0.5px $border-color;
  color: $primary-heavy-color;
  font-size: 0.8rem;

  .retrospective-contents {
    display: flex;
    justify-content: flex-start;
    border-bottom: 2px dotted $border-color;
    margin-bottom: 0.5rem;
  }

  .icon-content {
    font-size: 0.4rem;
    text-align: center;
    vertical-align: middle;
    width: 15%;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;

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

  .retrospective-content {
    word-break: break-all;
    width: 85%;
    padding-bottom: 0.5rem;

    .name-container {
      display: flex;
      justify-content: flex-start;
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
      color: $primary-light-color;
      text-align: left;
      margin-bottom: 0.5rem;
    }

    .achieverate {
      text-align: left;
    }
  }

  .comment-container {
    display: flex;
    justify-content: flex-end;
    overflow: hidden;

    .comment {
      width: 85%;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-align: left;
    }
  }

  .image-container {
    padding-left: 15%;

    img {
      width: 50%;
      max-height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
}
</style>
