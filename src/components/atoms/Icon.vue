<template>
  <b-icon :icon="icon" :size="size" @click="click" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AtomsIcon extends Vue {
  @Prop(String) icon!: string
  @Prop(String) size!: string

  click() {
    this.$emit('click')
  }
}
</script>

<style lang="scss" scoped></style>
