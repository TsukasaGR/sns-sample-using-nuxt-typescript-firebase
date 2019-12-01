<template>
  <div>
    <button class="button" :class="[color, width]" @click="click">
      {{ value }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AtomsButton extends Vue {
  @Prop(String) value!: string
  @Prop({ type: String, default: 'is-primary' }) color!: string
  @Prop(String) width!: string

  click() {
    this.$emit('click')
  }
}
</script>

<style lang="scss" scoped>
.is-sub {
  background-color: $background-primary-color;
  border-color: $border-color;
  font-size: 0.8rem;
  width: 100%;
}

.width-100 {
  width: 100%;
}
</style>
