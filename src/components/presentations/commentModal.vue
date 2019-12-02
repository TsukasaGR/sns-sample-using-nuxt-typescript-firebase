<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        コメントする
      </p>
    </header>
    <section class="modal-card-body">
      <b-field label="コメント" label-position="on-border">
        <b-input
          :value="body"
          maxlength="140"
          type="textarea"
          @input="updateBody"
        ></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="closeModal()">
        Close
      </button>
      <button v-if="!canPost" class="button is-primary" disabled>
        Comment
      </button>
      <button v-else class="button is-primary" @click="comment()">
        Comment
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class PresentationsCommentModal extends Vue {
  @Prop({ type: String, required: true }) body!: string
  @Prop({ type: Boolean, required: true }) canPost!: string

  comment(): void {
    this.$emit('comment')
  }

  closeModal(): void {
    this.$emit('close-modal')
  }

  updateBody(value): void {
    this.$emit('update:body', value)
  }
}
</script>

<style lang="scss">
.action-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: $primary-light-color;
  text-align: center;
  line-height: 60px;
  color: $background-primary-color;
  cursor: pointer;
}
</style>
