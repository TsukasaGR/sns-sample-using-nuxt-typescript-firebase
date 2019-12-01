<template>
  <div class="help-message">
    <div class="message-container">
      <div class="main-message">
        <p>
          目標の種類に合わせて、
          <br />
          無理のない期間設定や記録をしましょう
        </p>
      </div>
      <div class="goal-explanation">
        <div class="circle condition">
          状態目標
        </div>
        <p class="sub-title">
          こうなりたい、こうありたいなどの
          <br />
          抽象的な目標
        </p>
        <p class="case-text">
          たとえば…
          <br />
          周りから信頼される人になりたい✊️
          <br />
          いつも視野を広く持っていたい👀
          <br />
          毎日楽しく過ごしたい😆️
          <br />
          健康で丈夫な体になりたい💪
        </p>
      </div>
      <div class="goal-explanation">
        <div class="circle result">
          結果目標
        </div>

        <p class="sub-title">
          努力次第で結果が変化する目標
        </p>
        <p class="case-text">
          たとえば…
          <br />
          3ヶ月で料理の品数を5品増やす🍳
          <br />
          〇〇の資格を取る✏️
          <br />
          今年中に3箇所旅行へ行く✈️
          <br />
          フルマラソンで4時間を切る✌️️
        </p>
      </div>
      <div class="goal-explanation">
        <div class="circle action">
          行動目標
        </div>
        <p class="sub-title">
          即実行に移せる具体的な目標
        </p>
        <p class="case-text">
          たとえば…
          <br />
          毎日ニュースサイトをチェックする📱
          <br />
          1日30分参考書を開く📕
          <br />
          週2回ランニングする🎽
          <br />
          1ヶ月間、お昼はサラダだけにする🥗
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class helpMessage extends Vue {}
</script>

<style lang="scss" scoped>
.help-message {
  background-color: $background-primary-color;
  color: $primary-heavy-color;
  border-radius: 16px;
  padding: 16px;
  width: 90%;
  margin: auto;
  font-weight: bold;

  .message-container {
    height: 100%;
    overflow-y: auto;

    .main-message {
      margin: auto;
      text-align: center;
      padding-bottom: 3rem;
    }

    .goal-explanation {
      text-align: center;
      padding-bottom: 3rem;

      .circle {
        color: $background-primary-color;
        width: 6rem;
        height: 6rem;
        line-height: 6rem;
        text-align: center;
        display: inline-block;
        border-radius: 50%;
        margin-bottom: 0.5rem;

        &.condition {
          background-color: #f86089;
        }

        &.result {
          background-color: #608ff8;
        }

        &.action {
          background-color: #f8be60;
        }
      }

      .sub-title {
        font-size: 0.9rem;
        padding-bottom: 1rem;
      }

      .case-text {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
