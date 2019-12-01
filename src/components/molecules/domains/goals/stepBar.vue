<template>
  <ol class="step-bar">
    <li class="visited">
      <span>1</span>
      <br />
      目標設定
    </li>
    <li :class="{ visited: visitedStep2 }">
      <span>2</span>
      <br />
      記録設定
    </li>
    <li :class="{ visited: visitedStep3 }">
      <span>3</span>
      <br />
      振り返り設定
    </li>
  </ol>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class GoalStepBar extends Vue {
  @Prop({ type: Number, required: true }) step!: number

  get visitedStep2(): boolean {
    return this.step > 1
  }
  get visitedStep3(): boolean {
    return this.step > 2
  }
}
</script>

<style lang="scss" scoped>
.step-bar {
  display: flex;
  max-width: 400px;
  position: relative;
  margin: 20px auto;
  text-align: center;
  font-weight: bold;

  .visited:after {
    background: $primary-color;
  }

  .visited span {
    background: $primary-color;
  }

  li {
    font-size: 12px;
    list-style: none;
    position: relative;
    width: 33.333%;

    &:after {
      background: $border-color;
      content: '';
      width: calc(100% - 24px);
      height: 3px;
      position: absolute;
      left: calc(-50% + 12px);
      top: 10px;
    }

    &:first-child:after {
      display: none;
    }

    span {
      background: $border-color;
      color: #ffffff;
      display: inline-block;
      height: 24px;
      margin-bottom: 5px;
      line-height: 24px;
      width: 24px;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      border-radius: 50%;
    }
  }
}
</style>
