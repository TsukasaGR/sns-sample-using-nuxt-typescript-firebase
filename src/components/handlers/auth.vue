<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  render: createElement => createElement('div'),
})
export default class ComponentsHandlersAuth extends Vue {
  mounted(): void {
    if (!this.$store.state.auth.isLoggedIn) this.$router.push('/login')
  }
}
</script>
