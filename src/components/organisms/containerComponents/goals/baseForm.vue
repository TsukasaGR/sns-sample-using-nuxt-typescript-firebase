<template>
  <div>
    <div>
      <div class="icon-container">
        <img class="icon" :src="icon" @click="selectFile" />
      </div>
      <div class="change-icon">
        <a @click="selectFile">画像を変更する</a>
      </div>
      <div class="upload">
        <input
          ref="file"
          type="file"
          name="file"
          class="none"
          @change="selectedFile"
        />
      </div>
    </div>
    <b-field label="目標" class="item-container">
      <div class="goal-text">
        <b-input v-model="goal.title" />
      </div>
    </b-field>
    <b-field class="item-container">
      <template slot="label">
        目標の種類
        <BaseIcon icon="help-circle" @click.native="openHelpModal()" />
      </template>
      <div class="buttons">
        <b-radio-button
          v-model="goal.goalType"
          native-value="状態目標"
          type="is-success"
        >
          <span>● 状態目標</span>
        </b-radio-button>
        <b-radio-button
          v-model="goal.goalType"
          native-value="結果目標"
          type="is-success"
        >
          <span>▲ 結果目標</span>
        </b-radio-button>
        <b-radio-button
          v-model="goal.goalType"
          native-value="行動目標"
          type="is-success"
        >
          <span>■ 行動目標</span>
        </b-radio-button>
      </div>
    </b-field>
    <b-field label="達成日" class="item-container">
      <div class="datepicker">
        <b-datepicker
          v-model="endAtDate"
          :min-date="new Date()"
          :show-week-number="false"
          placeholder="達成日を選択"
          icon="calendar-today"
        />
      </div>
    </b-field>
    <b-field label="タグ" class="item-container">
      <b-taginput
        v-model="tags"
        autocomplete
        :data="autocompleteTags"
        :allow-new="true"
        ellipsis
        icon="label"
        placeholder="Add a tag"
      />
    </b-field>
    <b-modal
      :active.sync="isHelpModalActive"
      aria-role="dialog"
      :aria-modal="true"
    >
      <HelpMessage class="help-message" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import * as types from '~/types/domainTypes'
import { GOAL_TYPES } from '~/constants/domainInits'
import { toDataUrlOfImage } from '~/modules/imageOperation'
import BaseIcon from '~/components/atoms/Icon.vue'
import HelpMessage from '~/components/molecules/domains/goals/helpMessage.vue'
import { user } from '~/modules/firebase/firestore/users'

@Component({
  components: {
    BaseIcon,
    HelpMessage,
  },
})
export default class GoalsBaseForm extends Vue {
  @Prop({ type: Object, required: true }) goal!: types.GoalDraftStep1
  endAtDate: Date = new Date()
  goalTypes: (types.GoalType | types.GoalTypeBlank)[] = GOAL_TYPES
  uploadFiles: File[] = []
  isHelpModalActive: boolean = false
  tag: string = ''
  tags: string[] = []
  user: types.User | null = null

  mounted() {
    // TODO: vuexなどを介した際、Timestamp型がObject型に変換されてしまうことがあるので念の為再度Timestamp型に変換しなおしている
    this.goal.endAt = firebase.firestore.Timestamp.fromMillis(
      this.goal.endAt.seconds * 1000
    )
    this.endAtDate = this.goal.endAt.toDate()
    if (this.goal.tags) this.tags = this.goal.tags
    this.setUser()
  }

  @Watch('endAtDate')
  onEndAtDateChanged(newval: Date) {
    this.goal.endAt = firebase.firestore.Timestamp.fromDate(newval)
  }

  @Watch('tags')
  onTagChanged(newval: string[]) {
    this.goal.tags = newval
  }

  // アイコン全般
  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }

  get autocompleteTags(): string[] {
    return this.user && this.user.tags ? this.user.tags : []
  }

  async setUser(): Promise<void> {
    if (this.goal && this.goal.userId) this.user = await user(this.goal.userId)
  }

  selectFile(): void {
    const file: HTMLInputElement = this.$refs.file as HTMLInputElement
    file.click()
  }

  selectedFile(e): void {
    toDataUrlOfImage(e.target.files[0])
      .then(url => {
        this.uploadFiles = e.target.files
        if (!this.goal) return
        this.goal.icon = url
        this.$emit('update:uploadFiles', this.uploadFiles)
      })
      .catch(error => {
        this.$buefy.toast.open('画像の反映に失敗しました')
        console.error(error)
      })
  }

  openHelpModal(): void {
    this.isHelpModalActive = true
  }

  changeType(type: types.GoalType): void {
    this.goal.goalType = type
  }
}
</script>

<style lang="scss" scoped>
.goal-text /deep/ {
  .input {
    border-radius: 0;
    border-style: solid none;
  }
}

.goal-container {
  padding: 1rem;
  width: 100%;
  background: $background-primary-color;
  border-bottom: solid 0.5px $border-color;

  .circle {
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: $border-color;
    margin-right: 20px;
  }

  .goal-contents {
    display: flex;
    justify-content: flex-start;
  }
}

.icon-container {
  width: 100%;
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 0.5rem;

  .icon {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
  }
}

.change-icon {
  width: 100%;
  font-size: 0.9rem;
  text-align: center;
}

.help-message {
  height: 80vh;
}

.item-container {
  &:not(:last-child) {
    margin-bottom: 12px;
  }
}

.buttons /deep/ {
  display: flex;
  justify-content: space-around;

  .button {
    border-radius: 5px !important;
  }
}
</style>
