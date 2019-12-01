<template>
  <SelectItemDetail :title="goal.title" :icon="icon" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import SelectItemDetail from '~/components/molecules/domains/goals/selectItemDetail.vue'

@Component({
  components: {
    SelectItemDetail,
  },
})
export default class SelectGoalItem extends Vue {
  @Prop({ type: Object, required: true }) goal!: types.Goal

  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }
}
</script>
