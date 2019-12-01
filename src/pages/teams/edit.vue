<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>チーム編集</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div class="pages-teams-edit">
        <div class="add-container">
          <div class="add-button-container">
            <a @click="setNewRow()">チームを作成する</a>
          </div>
        </div>
        <div v-if="teams.length === 0">
          <p>
            登録されているチームはありません
          </p>
        </div>
        <b-table v-else :data="teams" custom-detail-row default-sort="name">
          <template slot-scope="props">
            <b-table-column
              field="name"
              :visible="true"
              label="チーム名"
              sortable
              width="120"
            >
              <template>
                {{ props.row.name }}
              </template>
            </b-table-column>
            <b-table-column
              field="member"
              :visible="true"
              label="メンバー"
              sortable
            >
              <template>
                <b-taglist>
                  <b-tag
                    v-for="(user, index) in props.row.members"
                    :key="index"
                  >
                    {{ user.displayName }}
                  </b-tag>
                </b-taglist>
              </template>
            </b-table-column>
            <b-table-column
              field="objectID"
              :visible="true"
              label=" "
              width="50"
              centered
            >
              <b-button @click="setEditRow(props.row)">
                編集する
              </b-button>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <b-modal :active.sync="isModalActive" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="modal-card" style="width: auto">
              <header class="modal-card-head">
                <p class="modal-card-title">
                  チームを
                  {{ operationName }}
                  する
                </p>
              </header>
              <section class="modal-card-body">
                <b-field label="チーム名">
                  <b-input
                    v-model="inputRow.name"
                    class="add-item"
                    placeholder="チーム名"
                    required
                  />
                </b-field>

                <b-field label="メンバー">
                  <b-taginput
                    v-model="inputRow.members"
                    :value="tag"
                    autocomplete
                    :data="filteredUsers"
                    :open-on-focus="true"
                    field="displayName"
                    ellipsis
                    icon="label"
                    placeholder="メンバーを追加"
                    class="add-item"
                    @typing="updateFilteredUsers"
                  ></b-taginput>
                </b-field>
              </section>
              <footer class="modal-card-foot">
                <div class="button-area">
                  <button
                    class="button"
                    type="button"
                    @click="isModalActive = false"
                  >
                    Close
                  </button>
                  <button class="button is-primary" @click="storeOrUpdate()">
                    {{ operationName }}
                  </button>
                  <button class="button is-danger" @click="deleteTeam()">
                    削除する
                  </button>
                </div>
                <p class="note">
                  ※すべてのボタンに確認メッセージはありません。ご注意ください。
                </p>
              </footer>
            </div>
          </div>
        </div>
      </b-modal>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import cloneDeep from 'lodash/cloneDeep'
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import * as consts from '~/constants/domainInits'
import { allUser } from '~/modules/firebase/firestore/users'
import { allTeam } from '~/modules/firebase/firestore/teams'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { storeTeam, updateTeam, deleteTeam } from '~/apis/teams'

@Component({
  components: {
    BasePageTemplate,
  },
})
export default class PagesTeamEdit extends Mixins(BasePage) {
  users: types.User[] = []
  filteredUsers: types.User[] = []
  teams: types.Team[] = []
  isModalActive: boolean = false
  newRow: types.TeamDraft = cloneDeep(consts.TEAM_INIT_VALUE)
  editRow: types.TeamDraft = cloneDeep(consts.TEAM_INIT_VALUE)
  inputRow: types.TeamDraft = cloneDeep(this.newRow)
  tag = ''

  async mounted(): Promise<void> {
    await this.loginCheck()
    await this.initialize()
  }

  async initialize(): Promise<void> {
    this.startPageMounted()
    this.isModalActive = false
    this.newRow = cloneDeep(consts.TEAM_INIT_VALUE)
    this.editRow = cloneDeep(consts.TEAM_INIT_VALUE)
    this.inputRow = cloneDeep(consts.TEAM_INIT_VALUE)
    const promiseAll: any = []
    const promiseAllUser = async () => {
      this.users = await allUser()
      this.filteredUsers = this.users
    }
    const promiseAllTeam = async () => (this.teams = await allTeam())
    promiseAll.push(promiseAllUser())
    promiseAll.push(promiseAllTeam())
    await Promise.all(promiseAll)
    this.endPageMounted()
  }

  setNewRow(): void {
    this.isModalActive = true
    this.inputRow = cloneDeep(this.newRow)
  }

  setEditRow(row: types.Team): void {
    this.isModalActive = true
    this.inputRow = cloneDeep(row)
  }

  updateFilteredUsers(text): void {
    this.filteredUsers = this.users.filter(user => {
      return (
        user.displayName &&
        user.displayName.toLowerCase().includes(text.toLowerCase())
      )
    })
  }

  async storeOrUpdate(): Promise<void> {
    if (this.isEdit) await this.update()
    else await this.store()
  }

  async store(): Promise<void> {
    console.log(this.inputRow)
    if (!this.inputRow.name) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    try {
      this.startPageMounted()
      this.inputRow.createdAt = timestampOfCurrentTime()
      await storeTeam(this.inputRow)
      this.$buefy.toast.open('チームを作成しました☺️')
      await this.initialize()
    } catch {
      this.failedUpdate()
    }
  }

  async update(): Promise<void> {
    console.log(this.inputRow)
    if (!this.inputRow.name) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    try {
      this.startPageMounted()
      this.inputRow.updatedAt = timestampOfCurrentTime()
      await updateTeam(this.inputRow as types.Team)
      this.$buefy.toast.open('チームを更新しました☺️')
      await this.initialize()
    } catch {
      this.failedUpdate()
    }
  }

  async deleteTeam(): Promise<void> {
    if (!this.inputRow.objectID) {
      this.$buefy.toast.open('不正な処理です')
      return
    }
    try {
      this.startPageMounted()
      await deleteTeam(this.inputRow.objectID)
      this.$buefy.toast.open('チームを削除しました☺️')
      await this.initialize()
    } catch {
      this.failedUpdate()
    }
  }

  get isEdit(): boolean {
    return Boolean(this.inputRow.objectID)
  }
  get operationName(): string {
    return this.isEdit ? '更新' : '作成'
  }

  get filterdUsers(): types.User[] {
    return this.users
  }
}
</script>

<style lang="scss" scoped>
.pages-teams-edit {
  .add-container {
    .add-button-container {
      text-align: right;
    }
    .add-item-container {
      padding: 16px;
      display: flex;
      align-items: center;
      .add-item {
        margin: 8px;
      }
    }
  }
}
.modal-card-body {
  min-height: 450px;
}
.modal-card-foot {
  display: block;
  .button-area {
    display: flex;
    width: 100%;
    > :last-child {
      margin-left: auto;
    }
  }
}
.note {
  font-size: 0.9rem;
  color: red;
}
</style>
