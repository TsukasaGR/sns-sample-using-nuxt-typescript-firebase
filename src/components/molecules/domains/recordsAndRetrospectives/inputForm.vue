<template>
  <div>
    <b-field label="目標">
      <div v-if="goal">
        {{ goal.title }}
      </div>
    </b-field>
    <b-field>
      <template slot="label" class="form-item">
        <div class="label-container">
          <span class="label-item label-title">日付を選ぶ</span>
          <span class="label-item label-switch">
            <span>選択しない</span>
            <b-switch
              v-if="existsValidScheduleDates"
              :value="outOfSchedule"
              type="is-success"
              @input="changeOutOfSchedule"
            />
            <b-switch
              v-else
              v-model="outOfSchedule"
              disabled
              type="is-success"
            />
          </span>
        </div>
      </template>
      <div v-if="existsValidScheduleDates">
        <b-select v-if="!outOfSchedule" v-model="draft.scheduleDateId" expanded>
          <option value="" />
          <option
            v-for="(date, index) in scheduleDates"
            :key="index"
            :value="date.objectID"
          >
            {{ displayDate(date) }}
          </option>
        </b-select>
      </div>
    </b-field>
    <b-field v-if="type === 'retrospective'" label="達成率" class="form-item">
      <div class="text-area">
        <p>{{ draft.achieveRate }}%</p>
        <div class="achieve-rate-container">
          <b-slider
            v-model="draft.achieveRate"
            type="is-success"
            size="is-large"
            :min="0"
            :max="100"
            :step="10"
          />
        </div>
      </div>
    </b-field>
    <div class="past-information-container">
      <div class="past-information-modal">
        <b-modal :active.sync="isModalActive" scroll="keep">
          <TabList
            :records="records"
            :retrospectives="retrospectives"
            class="past-information"
          />
        </b-modal>
      </div>
    </div>
    <b-field>
      <template slot="label" class="form-item">
        <div class="label-container">
          <span class="label-item label-title">コメント</span>
          <span class="label-item label-pastinfo" @click="isModalActive = true">
            <span>過去の情報を参照する</span>
          </span>
        </div>
      </template>
      <div class="text-area">
        <b-input v-model="draft.comment" maxlength="500" type="textarea" />
      </div>
    </b-field>
    <b-field label="画像" class="form-item">
      <div>
        <b-button @click="selectFile">
          画像を選択する
        </b-button>
        <b-button
          v-if="draft.image"
          type="is-danger"
          icon-left="close"
          @click="deleteFile"
        >
          削除
        </b-button>
        <input
          ref="file"
          type="file"
          name="file"
          class="none"
          @change="selectedFile"
        />
        <div class="image-container">
          <img v-if="draft.image" :src="draft.image" />
          <p v-else>
            選択されていません
          </p>
        </div>
      </div>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { displayDatetimeByMMDDWEEK } from '~/modules/dayjs'
import { toDataUrlOfImage } from '~/modules/imageOperation'
import TabList from '~/components/molecules/domains/recordsAndRetrospectives/tabList.vue'

@Component({
  components: {
    TabList,
  },
})
export default class GoalItem extends Vue {
  @Prop({ type: String, required: true, default: 'record' })
  type!: types.ScheduleType
  @Prop({ type: Object, required: true }) goal!: types.Goal
  @Prop({ type: Array, required: false, default: [] }) records!: types.Record[]
  @Prop({ type: Array, required: false, default: [] })
  retrospectives!: types.Retrospective[]
  @Prop({ type: Object, required: true }) draft!:
    | types.RecordDraft
    | types.RetrospectiveDraft
  @Prop({ type: Array, required: true }) scheduleDates!: types.ScheduleDate[]
  @Prop({ type: Boolean, required: true }) outOfSchedule!: boolean
  @Prop({ type: Array, required: true }) uploadFiles!: File[]
  isModalActive: boolean = false

  displayDate(date: types.ScheduleDate): string {
    return displayDatetimeByMMDDWEEK(date.scheduleAt)
  }

  changeOutOfSchedule(value: boolean): void {
    this.$emit('update:outOfSchedule', value)
  }

  draftUpdate(): void {
    this.$emit('draft-update', this.draft)
  }

  selectFile(): void {
    const file: HTMLInputElement = this.$refs.file as HTMLInputElement
    file.click()
  }
  selectedFile(e): void {
    this.$emit('update:uploadFiles', this.uploadFiles)
    toDataUrlOfImage(e.target.files[0])
      .then(url => {
        this.uploadFiles.push(e.target.files)
        if (!this.draft) return
        this.draft.image = url
        this.draftUpdate()
      })
      .catch(error => {
        this.$buefy.toast.open('画像の反映に失敗しました')
        console.error(error)
      })
  }

  deleteFile(): void {
    this.uploadFiles.length = 0
    this.$emit('update:uploadFiles', this.uploadFiles)
    this.draft.image = undefined
    this.draftUpdate()
  }

  get existsValidScheduleDates(): boolean {
    return this.scheduleDates.length > 0
  }
}
</script>

<style lang="scss" scoped>
.past-information-container {
  margin: 20px 0;
  text-align: right;
  font-size: 0.9rem;

  .past-information-modal {
    text-align: left;
    .past-information {
      width: 100%;
      height: 80vh;
      background-color: $background-primary-color;
      margin: 0 auto;
      padding: 16px;
    }
  }
}

.label-container {
  display: flex;
  justify-content: space-around;

  .label-item {
    display: inline-block;
    width: 100%;
  }

  .label-title {
    text-align: left;
  }

  .label-switch,
  .label-pastinfo {
    font-weight: normal;
    font-size: 0.8rem;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      display: inline-block;

      &:not(:last-child) {
        padding-right: 4px;
      }
    }
  }
}

.form-item {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
}

.text-area {
  width: 95%;
  margin: auto;
  border-radius: 0.5rem;
  background-color: $background-primary-color;

  input {
    font-size: 0.9rem;
  }

  input:focus {
    outline: none;
  }
}

.image-container {
  padding: 8px 0;
  img {
    width: 50%;
    height: auto;
    border-radius: 8px;
  }
}

.achieve-rate-container {
  padding: 0 2rem;
}
</style>
