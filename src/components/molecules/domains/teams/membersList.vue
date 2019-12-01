<template>
  <div>
    <template v-if="contents.length === 0">
      <p>メンバーがいません</p>
    </template>
    <template v-else>
      <div>
        <MemberItem
          v-for="(content, index) in contents"
          :key="index"
          :content="content"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import MemberItem from '~/components/molecules/domains/teams/memberItem.vue'

@Component({
  components: {
    MemberItem,
  },
})
export default class TeamsMemberList extends Vue {
  @Prop({ type: Array, required: false, default: [] })
  contents!: types.UserWithGoals[]
}
</script>

<style lang="scss" scoped></style>
