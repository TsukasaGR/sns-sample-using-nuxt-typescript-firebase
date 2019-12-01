<template>
  <div class="layouts-navigation-icon">
    <template v-if="isTypeDefault || isTypeHorizontal || isTypeIcon">
      <b-icon pack="fas" :icon="icon" />
      <span v-if="!isTypeIcon" :class="{ str: isTypeDefault }">
        {{ message }}
      </span>
    </template>
    <div v-else-if="isTypeVertical" class="show-all-container">
      <b-icon pack="fas" :icon="icon" class="icon-block" />
      <div class="str-block">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

/*
 * default    | PC:アイコン+文言(横並び)、SP:アイコンのみ
 * vertical   | PC、スマホともにアイコン+文言(横並び)
 * horizontal | PC、スマホともにアイコン+文言(縦並び)
 * icon       | PC、スマホともにアイコンのみ
 */
type ShowType = 'default' | 'vertical' | 'horizontal' | 'icon'

@Component
export default class LayoutsNavigationIcon extends Vue {
  @Prop({ type: String, required: true }) icon!: string
  @Prop({ type: String, required: false }) message!: string
  @Prop({ type: String, default: 'default' }) type!: ShowType

  get isTypeDefault(): boolean {
    return this.type === 'default'
  }
  get isTypeVertical(): boolean {
    return this.type === 'vertical'
  }
  get isTypeHorizontal(): boolean {
    return this.type === 'horizontal'
  }
  get isTypeIcon(): boolean {
    return this.type === 'icon'
  }
}
</script>

<style lang="scss" scoped>
.layouts-navigation-icon {
  cursor: pointer;

  .str {
    @include breakpoint(sm) {
      display: none;
    }
  }

  .show-all-container {
    text-align: center;
    margin-right: 0.8rem;

    .icon-block {
      display: block;
    }

    .str-block {
      display: block;
      margin-top: -5px;
    }
  }
}
</style>
