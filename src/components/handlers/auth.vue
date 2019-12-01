<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  render: createElement => {
    return createElement('div')
  },
})
export default class PagesTimeline extends Vue {
  mounted(): void {
    if (!this.$store.state.auth.isLoggedIn) this.$router.push('/login')
  }
}
</script>
