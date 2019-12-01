<template>
  <div class="select-container">
    <div class="goal-container">
      <div class="circle">
        <img :src="icon" />
      </div>
      <div class="goal-title">
        <p class="goal-text">
          {{ title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class SelectGoalItemDetail extends Vue {
  @Prop() title!: string
  @Prop() icon!: string
}
</script>

<style lang="scss" scoped>
.select-container {
  padding: 0.5rem;
  margin: 0.5rem;
  border: solid 0.5px $border-color;
  border-radius: 4px;

  .goal-container {
    .circle {
      width: 2.5rem;
      height: 2.5rem;
      margin: auto;
      margin-bottom: 0.5rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .goal-title {
      text-align: center;
      font-size: 0.8rem;
      margin: auto;
      font-weight: bold;
      overflow: hidden;
      width: 100%;

      .goal-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
